using DTO;

namespace DAL.Intefaces
{
    public interface IProductDAL
    {
        Task<ProductDTO> CreateAsync(CreateProductDTO dto);
        Task<IEnumerable<ProductDTO>> GetAllAsync(string? color);
    }
}
