import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { motion } from "framer-motion";
import {
  Upload,
  Table,
  FileText,
  Database,
  Plus,
  X,
  File,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { searchEbayProducts } from "@/services/ebayService";

interface ProductInput {
  name: string;
  price: string;
  sku: string;
  description: string;
}

const emptyProduct = {
  name: "",
  price: "",
  sku: "",
  description: "",
};

const demoProducts = [
  {
    name: "Nike Air Zoom Pegasus 38 Running Shoes",
    price: "119.99",
    sku: "NK-AZ38-001",
    description: "Men's running shoes, size 10, black/white",
  },
  {
    name: "Apple AirPods Pro (2nd Generation)",
    price: "249.99",
    sku: "APP-AP2-001",
    description: "Wireless noise cancelling earbuds with charging case",
  },
  {
    name: "Samsung 50-inch 4K Smart TV",
    price: "399.99",
    sku: "SAM-TV50-001",
    description: "Crystal UHD 4K Smart TV with HDR",
  },
];

const UploadPage = () => {
  const navigate = useNavigate();
  const [uploadMethod, setUploadMethod] = useState<string | null>(null);
  const [products, setProducts] = useState<ProductInput[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleMethodSelect = (method: string) => {
    setUploadMethod(method);
    if (method === "manual") {
      setProducts([{ ...emptyProduct }]);
    } else if (method === "demo") {
      setProducts([...demoProducts]);
      toast({
        title: "Demo products loaded",
        description: "3 demo products have been loaded for testing",
      });
    } else {
      setProducts([]);
    }
  };

  const handleAddProduct = () => {
    setProducts([...products, { ...emptyProduct }]);
  };

  const handleRemoveProduct = (index: number) => {
    const newProducts = [...products];
    newProducts.splice(index, 1);
    setProducts(newProducts);
  };

  const handleProductChange = (
    index: number,
    field: keyof ProductInput,
    value: string
  ) => {
    const newProducts = [...products];
    newProducts[index][field] = value;
    setProducts(newProducts);
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileUpload = (file: File) => {
    setFileName(file.name);
    toast({
      title: "File uploaded",
      description: `${file.name} has been uploaded`,
    });

    setTimeout(() => {
      setProducts([...demoProducts]);
    }, 1000);
  };

  const handleSubmit = async () => {
    if (products.length === 0) {
      toast.error("Please add at least one product.");
      return;
    }

    if (products.some(p => !p.name.trim())) {
      toast.error("All products must have a name.");
      return;
    }

    setIsSubmitting(true);
    toast.info(`Preparing to compare ${products.length} products...`);

    try {
      const mainProduct = products[0];
      
      const similarProducts = await searchEbayProducts({
        keywords: mainProduct.name,
        itemsPerPage: 10,
      });

      sessionStorage.setItem(
        "comparisonData",
        JSON.stringify({
          mainProduct: {
            id: "p1",
            name: mainProduct.name,
            price: parseFloat(mainProduct.price),
            sku: mainProduct.sku,
            description: mainProduct.description,
          },
          similarProducts,
          timestamp: new Date().toISOString(),
        })
      );

      toast.success(`${products.length} products submitted for comparison`);
      
      navigate("/results");
    } catch (error) {
      console.error("Error processing products:", error);
      toast.error("Failed to process products. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Upload Products</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Upload your products for comparison with eBay listings. Choose a method below to get started.
          </p>
        </motion.div>

        {!uploadMethod ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {uploadOptions.map((option, index) => (
              <motion.div
                key={option.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass-card p-6 flex flex-col items-center text-center cursor-pointer hover:shadow-lg transition-all duration-300"
                onClick={() => handleMethodSelect(option.id)}
              >
                <div className="rounded-full w-16 h-16 flex items-center justify-center bg-primary/10 text-primary mb-4">
                  {option.icon}
                </div>
                <h3 className="text-lg font-medium mb-2">{option.title}</h3>
                <p className="text-sm text-muted-foreground">{option.description}</p>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="glass-card p-6 max-w-5xl mx-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-medium">
                {uploadMethod === "file"
                  ? "File Upload"
                  : uploadMethod === "manual"
                  ? "Manual Entry"
                  : "Demo Products"}
              </h2>
              <button
                onClick={() => setUploadMethod(null)}
                className="text-sm flex items-center text-muted-foreground hover:text-foreground transition-colors"
              >
                <X size={16} className="mr-1" />
                Change Method
              </button>
            </div>

            {uploadMethod === "file" && (
              <div
                className={`border-2 border-dashed rounded-xl p-10 text-center ${
                  isDragging
                    ? "border-primary bg-primary/5"
                    : "border-border bg-secondary/30"
                }`}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleFileDrop}
              >
                <File size={48} className="mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">
                  {fileName ? fileName : "Drag & Drop File"}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Support for CSV, Excel, or tab-delimited text files
                </p>
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  accept=".csv,.xlsx,.xls,.txt"
                  onChange={handleFileSelect}
                />
                <label
                  htmlFor="file-upload"
                  className="btn-secondary cursor-pointer inline-block"
                >
                  Browse Files
                </label>
                {fileName && (
                  <p className="mt-4 text-sm text-primary">{products.length} products loaded</p>
                )}
              </div>
            )}

            {(uploadMethod === "manual" || uploadMethod === "demo") && (
              <div>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="py-3 px-4 text-left font-medium text-sm">Product Name</th>
                        <th className="py-3 px-4 text-left font-medium text-sm">Price</th>
                        <th className="py-3 px-4 text-left font-medium text-sm">SKU/EAN</th>
                        <th className="py-3 px-4 text-left font-medium text-sm">Description</th>
                        <th className="py-3 px-4 text-left font-medium text-sm w-10"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((product, index) => (
                        <tr key={index} className="border-b border-border">
                          <td className="py-3 px-4">
                            <input
                              type="text"
                              value={product.name}
                              onChange={(e) =>
                                handleProductChange(index, "name", e.target.value)
                              }
                              placeholder="Product name"
                              className="glass-input w-full px-3 py-2"
                            />
                          </td>
                          <td className="py-3 px-4">
                            <div className="relative">
                              <span className="absolute left-3 top-2">$</span>
                              <input
                                type="text"
                                value={product.price}
                                onChange={(e) =>
                                  handleProductChange(index, "price", e.target.value)
                                }
                                placeholder="0.00"
                                className="glass-input w-full px-3 py-2 pl-6"
                              />
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <input
                              type="text"
                              value={product.sku}
                              onChange={(e) =>
                                handleProductChange(index, "sku", e.target.value)
                              }
                              placeholder="SKU or EAN"
                              className="glass-input w-full px-3 py-2"
                            />
                          </td>
                          <td className="py-3 px-4">
                            <input
                              type="text"
                              value={product.description}
                              onChange={(e) =>
                                handleProductChange(
                                  index,
                                  "description",
                                  e.target.value
                                )
                              }
                              placeholder="Brief description"
                              className="glass-input w-full px-3 py-2"
                            />
                          </td>
                          <td className="py-3 px-4">
                            {products.length > 1 && (
                              <button
                                onClick={() => handleRemoveProduct(index)}
                                className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                              >
                                <X size={16} />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {uploadMethod === "manual" && (
                  <button
                    onClick={handleAddProduct}
                    className="mt-4 flex items-center text-sm text-primary hover:text-primary/80 transition-colors"
                  >
                    <Plus size={16} className="mr-1" />
                    Add Another Product
                  </button>
                )}
              </div>
            )}

            {products.length > 0 && (
              <div className="mt-8 flex justify-end">
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="btn-primary flex items-center"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={16} className="mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Compare Products
                      <ArrowRight size={16} className="ml-2" />
                    </>
                  )}
                </button>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

const uploadOptions = [
  {
    id: "file",
    title: "File Upload",
    description: "Upload a CSV or Excel file with your product data",
    icon: <FileText size={24} />,
  },
  {
    id: "manual",
    title: "Manual Entry",
    description: "Manually enter your product details one by one",
    icon: <Table size={24} />,
  },
  {
    id: "demo",
    title: "Use Demo Data",
    description: "Test the system with our pre-loaded demo products",
    icon: <Database size={24} />,
  },
];

export default UploadPage;
