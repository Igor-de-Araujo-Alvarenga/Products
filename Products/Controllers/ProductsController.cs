using BLL.Interfaces;
using DTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Products.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ProductsController : ControllerBase
    {
        private readonly IProductsBLL ProductsBLL;
        public ProductsController(IProductsBLL productsBLL)
        {
             ProductsBLL = productsBLL;  
        }

        [HttpPost("Create")]
        [Authorize(Policy = "AdminOnly")]
        public async Task<IActionResult> CreateProduct(CreateProductDTO body)
        {
            try
            {
                var createdProduct = await ProductsBLL.CreateAsync(body);
                return CreatedAtAction(nameof(GetAll), createdProduct);
            }
            catch (Exception ex)
            {
                return BadRequest(new ErrorDTO(Message: ex.Message));
            }
        }

        [HttpGet("GetAll")]
        [Authorize(Policy = "AdminOnly")]
        public async Task<IActionResult> GetAll(string? color)
        {
            try
            {
                var products = await ProductsBLL.GetAllAsync(color);
                return Ok(products);
            }
            catch (Exception ex)
            {
                return BadRequest(new ErrorDTO(Message: ex.Message));
            }
        }
    }
}
