using BLL;
using Microsoft.Extensions.Configuration;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace Tests
{
    public class AuthenticationTests
    {
        private readonly AuthenticationBLL _authBLL;

        public AuthenticationTests()
        {
            var configuration = new ConfigurationBuilder()
                .AddInMemoryCollection(new Dictionary<string, string?>
                {
                    { "Jwt:SecretKey",         "277deb7a7dae7d0a2c845709927751bc11c5767de6ccfe3d728adbd2f0c64631" },
                    { "Jwt:Issuer",            "Products"                         },
                    { "Jwt:Audience",          "FrontProducts"                       },
                    { "Jwt:ExpirationMinutes", "60"                                  }
                })
                .Build();

            _authBLL = new AuthenticationBLL(configuration);
        }

        [Fact]
        public async Task GenerateToken_ShouldReturnValidToken()
        {
            // Arrange
            var userId = "1";
            var email = "user@test.com";

            // Act
            var token = await _authBLL.GenerateToken(userId, email);

            // Assert
            Assert.NotNull(token);
            Assert.NotEmpty(token);
        }

        [Fact]
        public async Task GenerateToken_ShouldContainCorrectClaims()
        {
            // Arrange
            var userId = "42";
            var email = "user@test.com";

            // Act
            var token = await _authBLL.GenerateToken(userId, email);
            var handler = new JwtSecurityTokenHandler();
            var jwt = handler.ReadJwtToken(token);

            // Assert
            Assert.Equal(userId, jwt.Claims.First(c => c.Type == JwtRegisteredClaimNames.Sub).Value);
            Assert.Equal(email, jwt.Claims.First(c => c.Type == JwtRegisteredClaimNames.Email).Value);
        }

        [Fact]
        public async Task GenerateToken_ShouldContainAdminRole()
        {
            // Arrange
            var token = await _authBLL.GenerateToken("1", "user@test.com");
            var handler = new JwtSecurityTokenHandler();
            var jwt = handler.ReadJwtToken(token);

            // Assert
            var roles = jwt.Claims
                           .Where(c => c.Type == "role" || c.Type == ClaimTypes.Role)
                           .Select(c => c.Value);

            Assert.Contains("Admin", roles);
        }

        [Fact]
        public async Task ValidateToken_ShouldReturnPrincipal_WhenTokenIsValid()
        {
            // Arrange
            var token = await _authBLL.GenerateToken("1", "user@test.com");

            // Act
            var principal = await _authBLL.ValidateToken(token);

            // Assert
            Assert.NotNull(principal);
            Assert.IsType<ClaimsPrincipal>(principal);
        }

        [Fact]
        public async Task ValidateToken_ShouldReturnCorrectUserId()
        {
            // Arrange
            var userId = "99";
            var token = await _authBLL.GenerateToken(userId, "user@test.com");

            // Act
            var principal = await _authBLL.ValidateToken(token);
            var sub = principal?.Claims
                              .FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
            // Assert
            Assert.Equal(userId, sub);
        }

        [Fact]
        public async Task ValidateToken_ShouldReturnNull_WhenTokenIsInvalid()
        {
            // Act
            var principal = await _authBLL.ValidateToken("this.is.invalid");

            // Assert
            Assert.Null(principal);
        }

        [Fact]
        public async Task ValidateToken_ShouldReturnNull_WhenTokenIsEmpty()
        {
            // Act
            var principal = await _authBLL.ValidateToken(string.Empty);

            // Assert
            Assert.Null(principal);
        }
    }
}