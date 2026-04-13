# Getting Started - Products API + React Frontend

## 📋 Prerequisites

- [.NET 6 SDK](https://dotnet.microsoft.com/en-us/download/dotnet/6.0)
- [Node.js](https://nodejs.org/) (v16 or higher)

#### Diagrams

- [Products Diagram](https://github.com/Igor-de-Araujo-Alvarenga/Products/ProductsDiagram.drawio.png)
- [Products flow](https://github.com/Igor-de-Araujo-Alvarenga/Products/products_payments_flow.pdf)

#### Build and run on windows

build.bat

#### Execute manual API
```
cd Products/
dotnet run --urls "https://localhost:7086"
```

#### Execute manual Front end

```
cd FrontProducts/
npm install
npm run dev 
```

## Application Overview

- Backend API
- Technology: .NET 6 Web API
- Database: In-memory (Entity Framework Core)
- URL: https://localhost:7086
- Https is required because is used JWT HTTP-Only

<hr/>

- Frontend
- Technology: React
- URL: https://localhost:5173
