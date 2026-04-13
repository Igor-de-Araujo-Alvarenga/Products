using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DTO
{
    public record CreateProductDTO(
        [Required(ErrorMessage = "Name is required.")]
        [MaxLength(100, ErrorMessage = "Name must not exceed 100 characters.")]
        string Name,

            [Required(ErrorMessage = "Description is required.")]
        [MaxLength(500, ErrorMessage = "Description must not exceed 500 characters.")]
        string Description,

            [Required]
        [Range(0, int.MaxValue, ErrorMessage = "Quantity is required a positive number.")]
        int Quantity,

            [Required]
        [Range(0.01, double.MaxValue, ErrorMessage = "Price is required a positive number.")]
        decimal Price,

        [Required(ErrorMessage = "Color is required.")]
        string Color
    );

}
