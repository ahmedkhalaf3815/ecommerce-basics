import React from "react";
import prisma from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  ArrowRight,
  Leaf,
  ShieldCheck,
  ShoppingCart,
  Truck,
} from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import BudgetPlannerSheet from "@/components/BudgetPlannerSheetWrapper";
import Image from "next/image";
const page = async () => {
  const getCategories = async () => {
    try {
      const categories = await prisma.category.findMany({
        take: 6,
        orderBy: { name: "asc" },
      });
      return categories;
    } catch (error) {
      console.error(
        "error fetching categories:",
        JSON.stringify(error, null, 2),
      );
      console.error(error);
      return [];
    }
  };

  const getFeaturedProducts = async () => {
    try {
      const products = await prisma.product.findMany({
        take: 4,
        orderBy: {
          createdAt: "desc",
        },
      });
      return products;
    } catch (error) {
      console.error(
        "error fetching featured products:",
        JSON.stringify(error, null, 2),
      );
      console.error(error);
      return [];
    }
  };

  const featuredProducts = await getFeaturedProducts();
  const categories = await getCategories();
  return (
    <main className="flex flex-col main-h-screen">
      {/* Hero Section */}

      <section className="relative bg-emerald-900 text-white overflow-hidden py-24 sm:py-32 ">
        <div className='absolute inset-0 bg-cover bg-center opacity-50 bg-[url("https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2574&q=80")]'></div>
        <div className="relative container mx-auto px-4 flex flex-col items-center text-center space-y-8">
          <div className="inline-flex items-center rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-sm font-medium text-emerald-300 ring-1 ring-inset ring-emerald-400/20 ">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 mr-2"></span>
            The Future of GroCery Shopping
          </div>
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl max-w-4xl leading-tight">
              Smart Shopping for <br />
              <span className="text-emerald-400"> Restoking Your Fridge</span>
            </h1>
            <p className="text-lg text-emerald-100 max-w-2xl mx-auto ">
              USe our Ai Budget Planner to Planner to genarate personalized meal
              plans and shopping list instantly. Save money and eat better with
              EcoCar AI
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
            <Button>
              <Link className="flex items-center gap-2" href="/products">
                Shop Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>

          <div className="flex items-center justify-center">
            <BudgetPlannerSheet />
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3  gap-8">
          <div className="flex flex-col items-center text-cente space-y-3 p-6 rounded-2xl bg-emerald-50/50 ">
            <div className="h-12 w-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center mb-2 ">
              <Leaf className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">100% Organic</h3>
            <p className="text-gray-600">
              Sourced directly from certified organic farms ensuring the best
              quality and taste.
            </p>
          </div>
          <div className="flex flex-col items-center text-cente space-y-3 p-6 rounded-2xl bg-emerald-50/50 ">
            <div className="h-12 w-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center mb-2 ">
              <Truck className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Fast Delivery</h3>
            <p className="text-gray-600">
              Same-day delivery available for orders placed before 12 PM.
            </p>
          </div>
          <div className="flex flex-col items-center text-cente space-y-3 p-6 rounded-2xl bg-emerald-50/50 ">
            <div className="h-12 w-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center mb-2 ">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Fresh Guranteed</h3>
            <p className="text-gray-600">Not satisfied? Get your money back.</p>
          </div>
        </div>
      </section>

      {/* Fetured Products */}
      <section className="py-20 bg-gary-50">
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">
                Fresh Arrivals
              </h2>
              <p className="text-gray-600 mt-2">
                Check out our latest arrivals
              </p>
            </div>
            <Link
              className="text-emerald-600 hover:text-emerald-700 hover:underline font-semibold flex items-center"
              href="/products"
            >
              View All
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>{" "}
          </div>
        </div>

        <div className="container mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredProducts.map((product) => (
            <Link
              href={`/products/${product.id}`}
              key={product.id}
              className="text-emerald-600 font-semibold hover:text-emerald-700  flex flex-col items-center"
            >
              <div className="group flex flex-col bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="aspect-4/3 overflow-hidden bg-gray-100 relative">
                  {/* Image Section */}

                  <Image
                    fill
                    src={product.image}
                    alt={product.name}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="hover:underline text-lg font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors ">
                    {product.name}
                  </h3>
                  <p className="text-sm line-clamp-2 mt-1 mb-4 flex-1 text-gray-500">
                    {product.description}
                  </p>
                  <div className="flex flex-col items-center justify-between mt-auto">
                    <span className="text-lg font-bold text-emerald-900">
                      ${Number(product.price).toFixed(2)}
                    </span>

                    <Button
                      variant="secondary"
                      className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100  w-full p-2"
                    >
                      <ShoppingCart className="h-4 w-4" />
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-gary-50">
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">
                Shop by Categories
              </h2>
              <p className="text-gray-600 mt-2">
                Check out our latest categories
              </p>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-12">
          <Carousel
            opts={{
              align: "start",
            }}
            className="w-full px-12"
          >
            <CarouselContent>
              {categories.map((category) => (
                <CarouselItem
                  key={category.id}
                  className="md:basis-1/2 lg:basis-1/3 xl:basis-1/4"
                >
                  <div className="p-1">
                    <Link
                      href={`/categories/${category.id}`}
                      className="text-emerald-600 font-semibold hover:text-emerald-700 flex flex-col items-center h-full"
                    >
                      <div className="group flex flex-col bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow h-full w-full">
                        <div className="aspect-4/3 overflow-hidden bg-gray-100 relative">
                          <Image
                            fill
                            src={category.image}
                            alt={category.name}
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                        <div className="p-4 flex-1 flex flex-col items-center">
                          <h3 className=" text-lg font-semibold text-gray-900 text-emerald-600 transition-colors ">
                            {category.name}
                          </h3>
                        </div>
                      </div>
                    </Link>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-gray-900">
              Simpler Grocery Shopping
            </h2>
            <p className="text-gray-600 mt-4 text-lg">
              Our AI-powered platform helps you plan meals, track your budget,
              and shop efficiently.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Connector Line (Desktop) */}
            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-emerald-200 via-emerald-400 to-emerald-200 -z-10"></div>

            <div className="flex flex-col items-center text-center bg-white">
              <div className="h-24 w-24 bg-emerald-100 rounded-full flex items-center justify-center mb-6 shadow-md border-4 border-white">
                <span className="text-3xl font-bold text-emerald-600">1</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Set Your Budget
              </h3>
              <p className="text-gray-600">
                Tell us how much you want to spend and your dietary preferences.
              </p>
            </div>
            <div className="flex flex-col items-center text-center bg-white">
              <div className="h-24 w-24 bg-emerald-100 rounded-full flex items-center justify-center mb-6 shadow-md border-4 border-white">
                <span className="text-3xl font-bold text-emerald-600">2</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Get AI Plan
              </h3>
              <p className="text-gray-600">
                We generate a complete meal plan and optimization shopping list
                for you.
              </p>
            </div>
            <div className="flex flex-col items-center text-center bg-white">
              <div className="h-24 w-24 bg-emerald-100 rounded-full flex items-center justify-center mb-6 shadow-md border-4 border-white">
                <span className="text-3xl font-bold text-emerald-600">3</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                One-Click Shop
              </h3>
              <p className="text-gray-600">
                Purchase all ingredients instantly with our integrated checkout.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-24 bg-emerald-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550989460-0adf9ea622e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center opacity-20"></div>
        <div className="container mx-auto px-4 relative flex flex-col items-center text-center space-y-8">
          <h2 className="text-3xl md:text-4xl font-bold">
            Join the EcoCart Community
          </h2>
          <p className="text-emerald-100 max-w-xl text-lg">
            Get exclusive offers, healthy recipes, and budget-saving tips
            delivered straight to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 border-white border rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
            <Button
              size="lg"
              className="bg-emerald-500 hover:bg-emerald-400 text-white font-semibold whitespace-nowrap px-8"
            >
              Subscribe
            </Button>
          </div>
          <p className="text-xs text-emerald-200/60 mt-4">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </section>
    </main>
  );
};

export default page;
