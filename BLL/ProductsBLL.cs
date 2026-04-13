using BLL.Interfaces;
using DAL.Intefaces;
using DTO;

namespace BLL
{
    public class ProductsBLL : IProductsBLL
    {
        private readonly IProductDAL ProductDAL;

        public ProductsBLL(IProductDAL productDAL) => ProductDAL = productDAL;

        public async Task<ProductDTO> CreateAsync(CreateProductDTO dto)
        => await ProductDAL.CreateAsync(dto);

       
        public async Task<IEnumerable<ProductDTO>> GetAllAsync(string? color) => await ProductDAL.GetAllAsync(color);
    }
}
