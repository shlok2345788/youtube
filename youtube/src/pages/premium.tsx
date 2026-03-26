import React, { useState } from "react";
import { useUser } from "@/lib/AuthContext";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import axiosInstance from "@/lib/axiosinstance";
import Script from "next/script";
import { Check, Star, Zap, Shield } from "lucide-react";

const PremiumPage = () => {
  const { user, login } = useUser();
  const [selectedPlan, setSelectedPlan] = useState<'bronze' | 'silver' | 'gold'>('bronze');
  const [loading, setLoading] = useState(false);

  interface RazorpayResponse {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }

  const handlePayment = async () => {
    if (!user) {
      toast.error("Please sign in to upgrade");
      return;
    }

    setLoading(true);
    try {
      const { data: order } = await axiosInstance.post("/user/payment/orders", { plan: selectedPlan });

      // Mock Order (Test Mode)
      if (order.id && order.id.startsWith("order_mock_")) {
        toast.info("Simulating test payment...");
        setTimeout(async () => {
          try {
            const res = await axiosInstance.post("/user/payment/verify", {
              razorpay_order_id: order.id,
              razorpay_payment_id: "pay_mock_" + Date.now(),
              razorpay_signature: "mock_signature",
              userId: user._id || user.id,
              plan: selectedPlan
            });
            if (res.data.user) {
              login(res.data.user);
            }
            toast.success(`Upgraded to ${selectedPlan.toUpperCase()}! Check your email for the invoice.`);
            setLoading(false);
          } catch (error) {
            console.error(error);
            toast.error("Mock verification failed");
            setLoading(false);
          }
        }, 1000);
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_placeholder",
        amount: order.amount,
        currency: order.currency,
        name: "YourTube Premium",
        description: `Upgrade to ${selectedPlan.toUpperCase()}`,
        order_id: order.id,
        handler: async function (response: RazorpayResponse) {
          try {
            const res = await axiosInstance.post("/user/payment/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              userId: user._id || user.id,
              plan: selectedPlan
            });
            if (res.data.user) {
              login(res.data.user);
            }
            toast.success("Payment verified! Welcome to Premium.");
          } catch (e) {
            toast.error("Verification failed");
          } finally {
             setLoading(false);
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
        },
        theme: { color: "#ff0000" },
      };

      const rzp1 = new (window as any).Razorpay(options);
      rzp1.open();
    } catch (error) {
      console.error(error);
      toast.error("Could not initiate payment");
      setLoading(false);
    }
  };

  const plans = [
    {
      id: 'bronze',
      name: 'Bronze',
      price: '₹10',
      limit: '7 mins watch time',
      downloads: '1 free per day',
      icon: <Star className="w-8 h-8 text-amber-600" />,
      color: 'border-amber-600',
      bgColor: 'bg-amber-500/10'
    },
    {
      id: 'silver',
      name: 'Silver',
      price: '₹50',
      limit: '10 mins watch time',
      downloads: '1 free per day',
      icon: <Zap className="w-8 h-8 text-gray-400" />,
      color: 'border-gray-400',
      bgColor: 'bg-gray-400/10'
    },
    {
      id: 'gold',
      name: 'Gold',
      price: '₹100',
      limit: 'Unlimited watch time',
      downloads: 'Unlimited downloads',
      icon: <Shield className="w-8 h-8 text-yellow-500" />,
      color: 'border-yellow-500',
      bgColor: 'bg-yellow-500/10'
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground py-12 px-4 sm:px-6 lg:px-8">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl mb-4">
          Upgrade to YourTube <span className="text-red-600">Premium</span>
        </h1>
        <p className="text-xl text-muted-foreground mb-12">
          Pick the plan that fits your viewing habits. Switch tiers anytime.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {plans.map((plan) => (
            <div
              key={plan.id}
              onClick={() => setSelectedPlan(plan.id as any)}
              className={`relative p-8 rounded-2xl border-2 cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                selectedPlan === plan.id 
                ? `${plan.color} ${plan.bgColor} shadow-xl scale-105` 
                : 'border-border bg-card'
              }`}
            >
              {selectedPlan === plan.id && (
                <div className="absolute top-4 right-4 bg-red-600 text-white p-1 rounded-full">
                  <Check className="w-4 h-4" />
                </div>
              )}
              <div className="mb-4 flex justify-center">{plan.icon}</div>
              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <p className="text-3xl font-extrabold mb-6 font-sans">{plan.price}</p>
              <ul className="text-sm text-muted-foreground space-y-3 text-left">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500 shrink-0" />
                  <span>{plan.limit}</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500 shrink-0" />
                  <span>{plan.downloads}</span>
                </li>
              </ul>
            </div>
          ))}
        </div>

        <div className="bg-card border p-8 rounded-3xl max-w-lg mx-auto shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <span className="text-lg font-medium">Selected Tier:</span>
            <span className="text-2xl font-bold uppercase text-red-600">{selectedPlan}</span>
          </div>
          <Button 
            disabled={loading}
            onClick={handlePayment} 
            className="w-full py-7 text-xl bg-red-600 hover:bg-red-700 rounded-full font-bold shadow-lg transition-transform hover:scale-[1.02]"
          >
            {loading ? "Processing..." : `Upgrade Now • ₹${selectedPlan === 'bronze' ? '10' : selectedPlan === 'silver' ? '50' : '100'}`}
          </Button>
          <p className="text-xs text-muted-foreground mt-4">
            Payments are secured via Razorpay. Cancellations are instant.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PremiumPage;
