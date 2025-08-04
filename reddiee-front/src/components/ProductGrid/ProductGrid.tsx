interface Product {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  description: string;
}

export default function ProductGrid({ products }: { products: Product[] }) {
  console.log(products);
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 ">
      {products.map((product) => (
        <div
          key={product.id}
          className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition"
        >
          <img
            src={`${process.env.NEXT_PUBLIC_API_URL}${product.imageUrl}`}
            alt={product.name}
            className="w-full h-48 object-contain p-5"
          />
          <div className="p-4">
            <h2 className="text-lg font-semibold">{product.name}</h2>
            <p className="text-sm text-gray-600">
              {product.price.toLocaleString()}원
            </p>
            <p>{product.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
