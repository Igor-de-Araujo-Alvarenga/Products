using DAL;
using DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.Interfaces
{
    public interface IProductsBLL
    {
        Task<ProductDTO> CreateAsync(CreateProductDTO dto);
        Task<IEnumerable<ProductDTO>> GetAllAsync(string? color);
    }
}
