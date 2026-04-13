using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace BLL.Interfaces
{
    public interface IAuthenticationBLL
    {
        Task<string> GenerateToken(string userId, string email);
        Task<ClaimsPrincipal?> ValidateToken(string token);
    }
}
