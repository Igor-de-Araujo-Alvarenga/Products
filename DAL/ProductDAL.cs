using DAL.Entities;
using DAL.Intefaces;
using DTO;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL
{
    public class ProductDAL : IProductDAL
    {
        private readonly AppDbContext _context;

        public ProductDAL(AppDbContext context) => _context = context;

        public async Task<ProductDTO> CreateAsync(CreateProductDTO dto)
        {
            var product = new Product
            {
                Name = dto.Name,
                Description = dto.Description,
                Quantity = dto.Quantity,
                Price = dto.Price,
                Color = dto.Color,
                Active = true,
                CreatedAt = DateTime.UtcNow
            };

            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            return ToDTO(product);
        }

        public async Task<IEnumerable<ProductDTO>> GetAllAsync(string? color)
        {
            return await _context.Products
                .Where(p => string.IsNullOrEmpty(color) ? true : p.Color.Equals(color, StringComparison.InvariantCultureIgnoreCase))
                .Select(p => ToDTO(p))
                .ToListAsync();
        }

        private static ProductDTO ToDTO(Product p) => new(
            p.Id, p.Name, p.Description,
            p.Quantity, p.Active, p.Price,
            p.Color, p.CreatedAt, p.UpdateAt
        );
    }

}
