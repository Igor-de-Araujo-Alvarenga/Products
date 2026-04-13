namespace DTO
{
    public record ProductDTO
    (
        long Id,
        string Name,
        string Description,
        int Quantity,
        bool Active,
        decimal Price,
        string Color,
        DateTime CreatedAt,
        DateTime? UpdateAt
    );
}
