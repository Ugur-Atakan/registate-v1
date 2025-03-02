import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AdminDashboardLayout from "../../../components/layout/AdminDashboardLayout";
import {
  ArrowLeft,
  Bell,
  Package,
  DollarSign,
  Calendar,
  CheckCircle2,
  Star,
  Clock,
  Repeat,
  Shield,
  Info,
  Edit,
  Trash,
  AlertTriangle
} from "lucide-react";
import instance from "../../../http/instance";
import toast from "react-hot-toast";

interface Price {
  id: string;
  name: string;
  unit_amount: number;
  currency: string;
  type: string;
  description: string;
  features: string[];
  recurring?: {
    interval: string;
    interval_count: number;
  };
}

interface Product {
  id: string;
  name: string;
  description: string;
  stripeProductId: string;
  active: boolean;
  features: string[];
  productType: string;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
  prices: Price[];
}

export default function ProductDetails() {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProductDetails = async () => {
      if (!location.state?.productId) {
        toast.error("Product ID is missing");
        navigate("/admin/products");
        return;
      }

      try {
        const response = await instance.get(
          `/admin/product/${location.state.productId}/details`
        );
        setProduct(response.data);
      } catch (error) {
        console.error("Error fetching product details:", error);
        toast.error("Failed to load product details");
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [location.state?.productId, navigate]);

  const handleDelete = async () => {
    if (!product) return;

    try {
      await instance.delete(`/admin/product/${product.id}`);
      toast.success("Product deleted successfully");
      navigate("/admin/products");
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product");
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
      minimumFractionDigits: 2,
    }).format(amount / 100);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <AdminDashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[--primary]"></div>
        </div>
      </AdminDashboardLayout>
    );
  }

  if (!product) {
    return (
      <AdminDashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-gray-500">Product not found</div>
        </div>
      </AdminDashboardLayout>
    );
  }

  return (
    <AdminDashboardLayout>
      <main className="lg:p-8">
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/admin/products")}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-bold">{product.name}</h1>
              <p className="text-gray-600 mt-1">Product Details</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(`/admin/products/edit/`, { state: { productId: product.id } })}
              className="flex items-center gap-2 px-4 py-2 text-[--primary] bg-[--primary]/10 
                rounded-lg hover:bg-[--primary]/20 transition-colors"
            >
              <Edit size={18} />
              Edit Product
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="flex items-center gap-2 px-4 py-2 text-red-600 bg-red-50 
                rounded-lg hover:bg-red-100 transition-colors"
            >
              <Trash size={18} />
              Delete
            </button>
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
              <Bell className="w-5 h-5" />
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[--primary]/10 rounded-lg">
                    <Package className="w-5 h-5 text-[--primary]" />
                  </div>
                  <h2 className="text-lg font-semibold">Basic Information</h2>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                    product.active 
                      ? 'bg-green-50 text-green-700' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {product.active ? 'Active' : 'Inactive'}
                  </span>
                  {product.isFeatured && (
                    <span className="px-3 py-1 text-sm font-medium rounded-full bg-yellow-50 text-yellow-700">
                      Featured
                    </span>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-gray-500 mb-1">
                    Product Type
                  </label>
                  <p className="font-medium">{product.productType}</p>
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-1">
                    Stripe Product ID
                  </label>
                  <p className="font-medium font-mono text-sm">{product.stripeProductId}</p>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-500 mb-1">
                    Description
                  </label>
                  <p className="text-gray-700">{product.description}</p>
                </div>
              </div>

              {/* Features */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="font-medium mb-4">Features</h3>
                <div className="grid md:grid-cols-2 gap-3">
                  {product.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <CheckCircle2 className="text-[--accent] mt-1" size={16} />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Pricing Plans */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[--primary]/10 rounded-lg">
                    <DollarSign className="w-5 h-5 text-[--primary]" />
                  </div>
                  <h2 className="text-lg font-semibold">Pricing Plans</h2>
                </div>
                <button className="text-[--primary] text-sm hover:underline">
                  Manage Prices
                </button>
              </div>

              <div className="space-y-6">
                {product.prices.map((price) => (
                  <div key={price.id} className="p-6 bg-gray-50 rounded-xl">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-lg">{price.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-2xl font-bold">
                            {formatCurrency(price.unit_amount, price.currency)}
                          </span>
                          {price.recurring && (
                            <span className="text-gray-500">
                              /{price.recurring.interval}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {price.type === 'recurring' && (
                          <span className="px-2 py-1 text-xs bg-blue-50 text-blue-600 rounded-full">
                            Recurring
                          </span>
                        )}
                        {price.isDefault && (
                          <span className="px-2 py-1 text-xs bg-green-50 text-green-600 rounded-full">
                            Default
                          </span>
                        )}
                      </div>
                    </div>

                    {price.features && price.features.length > 0 && (
                      <div className="mt-4 space-y-2">
                        {price.features.map((feature, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <CheckCircle2 className="text-[--accent]" size={16} />
                            <span className="text-sm text-gray-600">{feature}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Clock size={16} />
                          <span>Created: {formatDate(price.createdAt)}</span>
                        </div>
                        {price.recurring && (
                          <div className="flex items-center gap-1">
                            <Repeat size={16} />
                            <span>
                              Every {price.recurring.interval_count} {price.recurring.interval}(s)
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status Card */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Product Status</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-500 mb-2 block">Created</label>
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-gray-400" />
                    <span>{formatDate(product.createdAt)}</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-500 mb-2 block">Last Updated</label>
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-gray-400" />
                    <span>{formatDate(product.updatedAt)}</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-500 mb-2 block">Status</label>
                  <div className="flex items-center gap-2">
                    <Shield size={16} className="text-gray-400" />
                    <span>{product.active ? 'Active' : 'Inactive'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total Plans</span>
                  <span className="font-medium">{product.prices.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Features</span>
                  <span className="font-medium">{product.features.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Default Price</span>
                  <span className="font-medium">
                    {product.prices.find(p => p.isDefault)?.name || 'None'}
                  </span>
                </div>
              </div>
            </div>

            {/* Help Text */}
            <div className="bg-blue-50 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <Info className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
                <div>
                  <h4 className="font-medium text-blue-900">Managing Products</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    Keep your product information up to date to ensure customers have the most accurate
                    information. Regular updates help maintain product relevance and improve sales.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-md w-full p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Delete Product</h3>
                  <p className="text-sm text-gray-500">This action cannot be undone</p>
                </div>
              </div>

              <p className="text-gray-600 mb-6">
                Are you sure you want to delete "{product.name}"? This will permanently remove the
                product and all associated data.
              </p>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 
                    transition-colors"
                >
                  Delete Product
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </AdminDashboardLayout>
  );
}