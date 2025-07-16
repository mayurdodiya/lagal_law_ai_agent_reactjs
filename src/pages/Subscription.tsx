// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { ArrowLeft, Check, Loader2 } from "lucide-react";

// import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { useAuth } from "@/contexts/AuthContext";
// import { supabase } from "@/integrations/supabase/client";

// const plans = [
//   {
//     name: "Basic",
//     price: "$10",
//     period: "per month",
//     description: "Ideal for solo practitioners or light users.",
//     features: ["Choose up to 3 GPTs (GPT-4 or Claude)", "Full access to AI prompt creation support", "Integrated AI support (prompt building, initial use guidance, etc.)"],
//     buttonText: "Choose Basic",
//     buttonVariant: "outline" as const,
//     paymentLink: "https://your-payment-link.com/basic",
//   },
//   {
//     name: "Professional",
//     price: "$25",
//     period: "per month",
//     description: "Everything in Basic, plus priority support and more AI coverage.",
//     features: ["Choose up to 6 GPTs (GPT-4 or Claude)", "One consultation with a real lawyer per month", "Everything in Basic", "Priority support", "More AI coverage"],
//     buttonText: "Choose Professional",
//     buttonVariant: "default" as const,
//     paymentLink: "https://your-payment-link.com/professional",
//   },
//   {
//     name: "Premium",
//     price: "$100",
//     period: "per month",
//     description: "Access to all GPTs across every area of law.",
//     features: ["Access to all GPTs", "Concept maps", "Audio/video summaries", "Podcast-style content", "WhatsApp Business integration", "Three lawyer consultations per month", "Integrated AI support (prompt building, initial use guidance, etc.)"],
//     buttonText: "Choose Premium",
//     buttonVariant: "outline" as const,
//     paymentLink: "https://your-payment-link.com/premium",
//   },
// ];

// const Subscription = () => {
//   const navigate = useNavigate();
//   const [loadingPlan, setLoadingPlan] = useState<string | null>(null);



//   const handleSubscribe = (plan: (typeof plans)[0]) => {
//     setLoadingPlan(plan.name);
//     setTimeout(() => {
//       // In a real app, you'd redirect to the payment link:
//       // window.location.href = plan.paymentLink;
//       navigate("/chat");
//     }, 1200);
//   };

//   return (
//     <div className="min-h-screen bg-background">
//       {/* Header */}
//       <header className="relative bg-primary text-primary-foreground shadow-md">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-center relative">
//           <h1 className="text-3xl font-bold tracking-tight">Subscription Plans</h1>
//         </div>
//         <Button variant="ghost" onClick={() => navigate("/dashboard")} className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center hover:bg-primary/90">
//           <ArrowLeft className="mr-2 h-5 w-5" />
//           <span className="font-medium">Back</span>
//         </Button>
//       </header>
  
//       {/* Main Content */}
//       <main className="flex-1 flex flex-col items-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
//         {/* Pricing Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
//           {plans.map((plan) => (
//             <Card key={plan.name} className={`flex flex-col transition-all duration-300 ease-in-out ${hoveredPlan === plan.name ? "border-primary shadow-lg scale-105" : "border-border"}`} onMouseEnter={() => setHoveredPlan(plan.name)} onMouseLeave={() => setHoveredPlan(null)}>
//               <CardHeader className="text-center pb-4">
//                 <CardTitle className="text-2xl font-bold tracking-wide">{plan.name}</CardTitle>
//                 <div className="mt-2">
//                   <span className="text-4xl font-extrabold text-primary">{plan.price}</span>
//                   <span className="text-muted-foreground ml-1">{plan.period}</span>
//                 </div>
//                 <CardDescription className="mt-1 text-base">{plan.description}</CardDescription>
//               </CardHeader>

//               <CardContent className="flex flex-col flex-1 justify-between px-6 pb-6">
//                 <ul className="space-y-3 mb-6">
//                   {plan.features.map((feature, featureIndex) => (
//                     <li key={featureIndex} className="flex items-start">
//                       <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
//                       <span className="text-sm text-muted-foreground">{feature}</span>
//                     </li>
//                   ))}
//                 </ul>
//                 <Button variant={hoveredPlan === plan.name ? "default" : "outline"} disabled={loadingPlan === plan.name} className="w-full py-3 text-base font-semibold" onClick={() => handleSubscribe(plan)}>
//                   {loadingPlan === plan.name ? (
//                     <>
//                       <Loader2 className="mr-2 h-5 w-5 animate-spin" />
//                       Processing...
//                     </>
//                   ) : (
//                     plan.buttonText
//                   )}
//                 </Button>
//               </CardContent>
//             </Card>
//           ))}
//         </div>
  
//         {/* FAQ Section */}
//         <div className="mt-16 w-full max-w-4xl">
//           <h3 className="text-2xl font-bold text-center mb-6">Frequently Asked Questions</h3>
//           <Accordion type="single" collapsible className="w-full">
//             <AccordionItem value="item-1">
//               <AccordionTrigger>Can I change my plan anytime?</AccordionTrigger>
//               <AccordionContent>Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.</AccordionContent>
//             </AccordionItem>
//             <AccordionItem value="item-2">
//               <AccordionTrigger>Is there a free trial?</AccordionTrigger>
//               <AccordionContent>Our Free plan is available forever with no credit card required. You can upgrade when you're ready for more features.</AccordionContent>
//             </AccordionItem>
//             <AccordionItem value="item-3">
//               <AccordionTrigger>What payment methods do you accept?</AccordionTrigger>
//               <AccordionContent>We accept all major credit cards, including Visa, Mastercard, and American Express.</AccordionContent>
//             </AccordionItem>
//           </Accordion>
//         </div>
//       </main>
  
//       {/* Footer */}
//       <footer className="bg-primary py-4">
//         <div className="max-w-7xl mx-auto px-4 flex justify-center items-center">
//           <span className="font-semibold text-sm tracking-wide text-primary-foreground"> 2025 Legal Corp, LLC.</span>
//         </div>
//       </footer>
//     </div>
//   );
// };

// export default Subscription;






import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Check, Loader2 } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
const plans = [
  {
    name: "Basic",
    price: "$10",
    period: "per month",
    description: "Ideal for solo practitioners or light users.",
    features: ["Choose up to 3 GPTs (GPT-4 or Claude)", "Full access to AI prompt creation support", "Integrated AI support (prompt building, initial use guidance, etc.)"],
    buttonText: "Choose Basic",
    buttonVariant: "outline" as const,
    paymentLink: "https://your-payment-link.com/basic",
  },
  {
    name: "Professional",
    price: "$25",
    period: "per month",
    description: "Everything in Basic, plus priority support and more AI coverage.",
    features: ["Choose up to 6 GPTs (GPT-4 or Claude)", "One consultation with a real lawyer per month", "Everything in Basic", "Priority support", "More AI coverage"],
    buttonText: "Choose Professional",
    buttonVariant: "default" as const,
    paymentLink: "https://your-payment-link.com/professional",
  },
  {
    name: "Premium",
    price: "$100",
    period: "per month",
    description: "Access to all GPTs across every area of law.",
    features: ["Access to all GPTs", "Concept maps", "Audio/video summaries", "Podcast-style content", "WhatsApp Business integration", "Three lawyer consultations per month", "Integrated AI support (prompt building, initial use guidance, etc.)"],
    buttonText: "Choose Premium",
    buttonVariant: "outline" as const,
    paymentLink: "https://your-payment-link.com/premium",
  },
];
const Subscription = () => {
  const navigate = useNavigate();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [hoveredPlan, setHoveredPlan] = useState<string | null>(null);
  const { user, loading, setUser } = useAuth();
  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
    const fetchUserProfileData = async () => {
      if (!user?.id) return;
      const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      if (user && !user?.userProfileInfo) {
        setUser((prevData: any) => ({ ...prevData, userProfileInfo: data }));
      }
      if (data?.isPlanPurchased === true && data?.planId) {
        navigate("/chat");
      }
    };
    fetchUserProfileData();
  }, [user, loading, navigate, setUser]);
  const handleSubscribe = (plan: (typeof plans)[0]) => {
    setLoadingPlan(plan.name);
    setTimeout(() => {
      // In a real app, you'd redirect to the payment link:
      // window.location.href = plan.paymentLink;
      navigate("/chat");
    }, 1200);
  };
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="relative bg-primary text-primary-foreground shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-center relative">
          <h1 className="text-3xl font-bold tracking-tight">Subscription Plans</h1>
        </div>
        <Button variant="ghost" onClick={() => navigate("/dashboard")} className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center hover:bg-primary/90">
          <ArrowLeft className="mr-2 h-5 w-5" />
          <span className="font-medium">Back</span>
        </Button>
      </header>
      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
          {plans.map((plan) => (
            <Card key={plan.name} className={`flex flex-col transition-all duration-300 ease-in-out ${hoveredPlan === plan.name ? "border-primary shadow-lg scale-105" : "border-border"}`} onMouseEnter={() => setHoveredPlan(plan.name)} onMouseLeave={() => setHoveredPlan(null)}>
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl font-bold tracking-wide">{plan.name}</CardTitle>
                <div className="mt-2">
                  <span className="text-4xl font-extrabold text-primary">{plan.price}</span>
                  <span className="text-muted-foreground ml-1">{plan.period}</span>
                </div>
                <CardDescription className="mt-1 text-base">{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col flex-1 justify-between px-6 pb-6">
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button variant={hoveredPlan === plan.name ? "default" : "outline"} disabled={loadingPlan === plan.name} className="w-full py-3 text-base font-semibold" onClick={() => handleSubscribe(plan)}>
                  {loadingPlan === plan.name ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    plan.buttonText
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        {/* FAQ Section */}
        <div className="mt-16 w-full max-w-4xl">
          <h3 className="text-2xl font-bold text-center mb-6">Frequently Asked Questions</h3>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>Can I change my plan anytime?</AccordionTrigger>
              <AccordionContent>Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Is there a free trial?</AccordionTrigger>
              <AccordionContent>Our Free plan is available forever with no credit card required. You can upgrade when you're ready for more features.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>What payment methods do you accept?</AccordionTrigger>
              <AccordionContent>We accept all major credit cards, including Visa, Mastercard, and American Express.</AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </main>
      {/* Footer */}
      <footer className="bg-primary py-4">
        <div className="max-w-7xl mx-auto px-4 flex justify-center items-center">
          <span className="font-semibold text-sm tracking-wide text-primary-foreground"> 2025 Legal Corp, LLC.</span>
        </div>
      </footer>
    </div>
  );
};
export default Subscription;