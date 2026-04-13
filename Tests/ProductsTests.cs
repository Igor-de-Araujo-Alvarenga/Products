

using BLL;
using DAL;
using DTO;
using Microsoft.EntityFrameworkCore;

namespace Tests
{
    public class ProductsTests
    {
        private readonly ProductsBLL _productsBLL;

        public ProductsTests()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            var context = new AppDbContext(options);
            var productDAL = new ProductDAL(context);
            _productsBLL = new ProductsBLL(productDAL);
        }

        [Fact]
        public async Task CreateAsync_ShouldReturnProductDTO()
        {
            // Arrange
            var dto = new CreateProductDTO("Product 1", "Description 1", 10, 9.99m, "Red");

            // Act
            var result = await _productsBLL.CreateAsync(dto);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(dto.Name, result.Name);
            Assert.Equal(dto.Description, result.Description);
            Assert.Equal(dto.Quantity, result.Quantity);
            Assert.Equal(dto.Price, result.Price);
            Assert.Equal(dto.Color, result.Color);
            Assert.True(result.Active);
        }

        [Fact]
        public async Task CreateAsync_ShouldPersistInDatabase()
        {
            // Arrange
            var dto = new CreateProductDTO("Product 2", "Description 2", 5, 19.99m, "Blue");

            // Act
            var result = await _productsBLL.CreateAsync(dto);
            var all = await _productsBLL.GetAllAsync(null);

            // Assert
            Assert.Single(all);
            Assert.Equal(result.Id, all.First().Id);
        }

        [Fact]
        public async Task GetAllAsync_ShouldReturnAllProducts()
        {
            // Arrange
            await _productsBLL.CreateAsync(new CreateProductDTO("Product 1", "Description 1", 10, 9.99m, "Red"));
            await _productsBLL.CreateAsync(new CreateProductDTO("Product 2", "Description 2", 5, 19.99m, "Blue"));

            // Act
            var result = await _productsBLL.GetAllAsync(null);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(2, result.Count());
        }

        [Fact]
        public async Task GetAllAsync_ShouldFilterByColor()
        {
            // Arrange
            await _productsBLL.CreateAsync(new CreateProductDTO("Product 1", "Description 1", 10, 9.99m, "Red"));
            await _productsBLL.CreateAsync(new CreateProductDTO("Product 2", "Description 2", 5, 19.99m, "Blue"));

            // Act
            var result = await _productsBLL.GetAllAsync("Red");

            // Assert
            Assert.Single(result);
            Assert.Equal("Red", result.First().Color);
        }

        [Fact]
        public async Task GetAllAsync_ShouldReturnEmpty_WhenNoProducts()
        {
            // Act
            var result = await _productsBLL.GetAllAsync(null);

            // Assert
            Assert.NotNull(result);
            Assert.Empty(result);
        }

        [Fact]
        public async Task GetAllAsync_ShouldReturnEmpty_WhenColorNotFound()
        {
            // Arrange
            await _productsBLL.CreateAsync(new CreateProductDTO("Product 1", "Description 1", 10, 9.99m, "Red"));

            // Act
            var result = await _productsBLL.GetAllAsync("Green");

            // Assert
            Assert.Empty(result);
        }
    }
}

