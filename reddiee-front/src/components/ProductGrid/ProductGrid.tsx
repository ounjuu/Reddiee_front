interface Product {
  id: number;
  name: string;
  price: number;
  image_url: string;
}

export default function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {products.map((product) => (
        <div
          key={product.id}
          className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition"
        >
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-48 object-cover"
          />
          <div className="p-4">
            <h2 className="text-lg font-semibold">{product.name}</h2>
            <p className="text-sm text-gray-600">
              {product.price.toLocaleString()}원
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
