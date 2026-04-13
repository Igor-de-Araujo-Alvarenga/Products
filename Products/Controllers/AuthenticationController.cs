using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using DTO;
using Microsoft.AspNetCore.Authorization;
using BLL.Interfaces;

namespace Products.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class AuthenticationController : ControllerBase
    {
        private readonly IAuthenticationBLL AuthBLL;
        public AuthenticationController(IAuthenticationBLL authBLL)
        {
            AuthBLL = authBLL;    
        }

        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> GenerateToken(AuthTokenRequestDTO body)
        {
            try
            {
                await ValidateRequireData(body);
                var userData = await AuthBLL.GenerateToken(Guid.NewGuid().ToString(), body.Email);
                Response.Cookies.Append("access_token", userData, new CookieOptions
                {
                    HttpOnly = true,                         
                    Secure = true,                           
                    SameSite = SameSiteMode.Strict,
                    Expires = DateTimeOffset.UtcNow.AddHours(1)
                });

                return Ok(new AuthTokenResponseDTO(Token: "Authenticated successfully")); 
            }
            catch(Exception ex) 
            {
                return Unauthorized(new ErrorDTO( Message: ex.Message ));
            }
        }
        [HttpPost("Logout")]
        [AllowAnonymous]
        public IActionResult Logout()
        {
            Response.Cookies.Delete("access_token");
            return Ok(new { message = "Logged out successfully" });
        }

        [HttpGet("Me")]
        [Authorize]
        public IActionResult Me()
        {
            var claims = User.Claims.ToDictionary(c => c.Type, c => c.Value);
            return Ok(claims);
        }
        private async Task ValidateRequireData(AuthTokenRequestDTO body)
        {
            var errors = new List<string>();

            if (string.IsNullOrEmpty(body.Email)) errors.Add("Email");

            if (string.IsNullOrEmpty(body.Password)) errors.Add("Password");

            if (errors.Count > 0)
                throw new Exception($"Required fields: {string.Join(',', errors)}");
        }
    }
}
