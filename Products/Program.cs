using BLL;
using BLL.Interfaces;
using DAL;
using DAL.Intefaces;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Collections.Generic;
using System.Text;

namespace Products
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            builder.Services.AddControllers();
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();
            builder.Services.AddScoped<IAuthenticationBLL, AuthenticationBLL>();
            builder.Services.AddScoped<IProductsBLL, ProductsBLL>();
            builder.Services.AddScoped<IProductDAL, ProductDAL>();
            builder.Services.AddDbContext<AppDbContext>(options =>
                options.UseInMemoryDatabase("ProductsDb"));

            builder.Services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.Events = new JwtBearerEvents
                {
                    OnMessageReceived = context =>
                    {
                        context.Token = context.Request.Cookies["access_token"];
                        return Task.CompletedTask;
                    }
                };

                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(
                                                    Encoding.UTF8.GetBytes(builder.Configuration["Jwt:SecretKey"]!)),
                    ValidateIssuer = true,
                    ValidIssuer = builder.Configuration["Jwt:Issuer"],
                    ValidateAudience = true,
                    ValidAudience = builder.Configuration["Jwt:Audience"],
                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.Zero
                };
            });
            builder.Services.AddAuthorization(options =>
            {
                options.AddPolicy("AdminOnly", policy => policy.RequireRole("Admin"));
            });
            builder.Services.AddSwaggerGen(options =>
            {
                options.SwaggerDoc("v1", new OpenApiInfo { Title = "Product API", Version = "v1" });
                options.AddSecurityDefinition("cookieAuth", new OpenApiSecurityScheme
                {
                    Name = "access_token",
                    Type = SecuritySchemeType.ApiKey,
                    In = ParameterLocation.Cookie,
                    Description = "Cookie de autenticação HTTP-only"
                });

                options.AddSecurityRequirement(new OpenApiSecurityRequirement
                    {
                        {
                            new OpenApiSecurityScheme
                            {
                                Reference = new OpenApiReference
                                {
                                    Type = ReferenceType.SecurityScheme,
                                    Id   = "cookieAuth"
                                }
                            },
                            Array.Empty<string>()
                        }
                    });
            });
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowFrontReact", policy =>
                {
                    policy.WithOrigins("https://localhost:5173")
                          .AllowAnyHeader()
                          .AllowAnyMethod()
                          .AllowCredentials();
                });
            });

            var app = builder.Build();
            app.UseCors("AllowFrontReact");
            app.MapGet("/HealthCheck", () => Results.Ok(new { status = "Healthy", timestamp = DateTime.UtcNow }))
                    .AllowAnonymous();
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();
            app.UseAuthentication(); 
            app.UseAuthorization();
            app.MapControllers();

            app.Run();
        }
    }
}
