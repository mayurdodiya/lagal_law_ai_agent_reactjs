import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { FaGoogle } from "react-icons/fa";
import { toast } from "sonner";
import TextFormInput from "@/helpers/TextFormInput";
import { useForm } from "react-hook-form";
import { z } from "zod/v4";
import { zodResolver } from "@hookform/resolvers/zod";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  // const initialFormData = {
  //   firstName: "",
  //   lastName: "",
  //   email: "",
  //   password: "",
  // };

  // const [formData, setFormData] = useState(initialFormData);

  // const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const { name, value } = e.target;
  //   setFormData((prevData) => ({
  //     ...prevData,
  //     [name]: value,
  //   }));
  // };

  const { user } = useAuth();
  const navigate = useNavigate();
  // const { toast } = useToast();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  // const handleEmailAuth = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setLoading(true);

  //   // try {
  //   //   if (isLogin) {
  //   //     const { error } = await supabase.auth.signInWithPassword({
  //   //       email: formData.email,
  //   //       password: formData.password,
  //   //     });

  //   //     if (error) {
  //   //       toast("Error", {
  //   //         description: error.message,
  //   //       });
  //   //     } else {
  //   //       setFormData(initialFormData);
  //   //       toast("Success", {
  //   //         description: "Logged in successfully!",
  //   //       });
  //   //       navigate("/subscription");
  //   //     }
  //   //   } else {
  //   //     const { error, data } = await supabase.auth.signUp({
  //   //       email: formData.email,
  //   //       password: formData.password,
  //   //       options: {
  //   //         emailRedirectTo: `${window.location.origin}/subscription`,
  //   //         data: {
  //   //           first_name: formData.firstName,
  //   //           last_name: formData.lastName,
  //   //           role: "user",
  //   //           display_name: `${formData.firstName} ${formData.lastName}`,
  //   //         },
  //   //       },
  //   //     });

  //   //     if (error) {
  //   //       toast("Error", {
  //   //         description: error.message,
  //   //       });
  //   //     } else {
  //   //       const { data: profilesData, error } = await supabase
  //   //         .from("profiles")
  //   //         .insert([
  //   //           {
  //   //             id: data?.user?.id,
  //   //             first_name: data?.user?.user_metadata?.first_name,
  //   //             last_name: data?.user?.user_metadata?.last_name,
  //   //             role: "user",
  //   //             email: data?.user?.email,
  //   //             isPlanPurchased: false,
  //   //             planId: null,
  //   //             phoneCountry: null,
  //   //             mobile: null,
  //   //           },
  //   //         ])
  //   //         .select();

  //   //       setFormData(initialFormData);

  //   //       toast("Success", {
  //   //         description:
  //   //           "Account created successfully! Please check your email to confirm your account.",
  //   //       });
  //   //     }
  //   //   }
  //   // } catch (error) {
  //   //   toast("Error", {
  //   //     description: "An unexpected error occurred",
  //   //   });
  //   // } finally {
  //   //   setLoading(false);
  //   // }
  // };

  const handleSocialLogin = async (provider: "google" | "github") => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) {
        toast("Error", {
          description: error.message,
        });
      }
    } catch (error) {
      toast("Error", {
        description: "An unexpected error occurred",
      });
    }
  };
  // const authenticationSchema = z.object({
  //   firstName: z.string().min(3).max(50),
  //   lastName: z.string().min(3).max(50),
  //   email: z.string().min(3).max(50),
  //   password: z.string().min(3).max(50),
  // });
  const loginSchema = z.object({
    email: z.string().min(3).max(50),
    password: z.string().min(3).max(50),
  });
  const signupSchema = z.object({
    firstName: z.string().min(3).max(50),
    lastName: z.string().min(3).max(50),
    email: z.string().min(3).max(50),
    password: z.string().min(3).max(50),
  });

  const authenticationSchema = isLogin ? loginSchema : signupSchema;

  type AuthenticationFormType = z.infer<typeof authenticationSchema>;

  const { control, handleSubmit, setValue, reset } =
    useForm<AuthenticationFormType>({
      resolver: zodResolver(authenticationSchema),
      defaultValues: {
        ...(!isLogin && {
          firstName: "",
          lastName: "",
        }),
        email: "",
        password: "",
      },
    });

  const submitHandler = async (fields: AuthenticationFormType) => {
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email: fields.email,
          password: fields.password,
        });

        if (error) {
          toast("Error", {
            description: error.message,
          });
        } else {
          // setFormData(initialFormData);
          toast("Success", {
            description: "Logged in successfully!",
          });
          reset();
          navigate("/dashboard");
        }
      } else {
        const { error, data } = await supabase.auth.signUp({
          email: fields.email,
          password: fields.password,
          options: {
            emailRedirectTo: `${window.location.origin}/subscription`,
            data: {
              first_name: fields?.firstName,
              last_name: fields?.lastName,
              role: "user",
              display_name: `${fields?.firstName} ${fields?.lastName}`,
            },
          },
        });

        if (error) {
          toast("Error", {
            description: error.message,
          });
        } else {
          const { data: profilesData, error } = await supabase
            .from("profiles")
            .insert([
              {
                id: data?.user?.id,
                first_name: data?.user?.user_metadata?.first_name,
                last_name: data?.user?.user_metadata?.last_name,
                role: "user",
                email: data?.user?.email,
                isPlanPurchased: false,
                planId: null,
                phoneCountry: null,
                mobile: null,
              },
            ])
            .select();

          // setFormData(initialFormData);
          reset();
          toast("Success", {
            description:
              "Account created successfully! Please check your email to confirm your account.",
          });
        }
      }
    } catch (error) {
      toast("Error", {
        description: "An unexpected error occurred!",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            {isLogin ? "Welcome back" : "Create account"}
          </CardTitle>
          <CardDescription className="text-center">
            {isLogin
              ? "Enter your credentials to access your account"
              : "Enter your details to create your account"}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Social Login Buttons */}
          <div className="w-full gap-4">
            <Button
              variant="outline"
              onClick={() => handleSocialLogin("google")}
              className="w-full"
            >
              <FaGoogle className="mr-2 h-4 w-4" />
              Google
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
            {!isLogin && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    {/* <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      placeholder="John"
                      value={formData.firstName}
                      name="firstName"
                      onChange={handleFormChange}
                      required
                    /> */}
                    <TextFormInput
                      control={control}
                      name="firstName"
                      label="First Name"
                      containerClassName="mx-0.5"
                      // fullWidth
                    />
                  </div>
                  <div className="space-y-2">
                    {/* <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      placeholder="Doe"
                      value={formData.lastName}
                      name="lastName"
                      onChange={handleFormChange}
                      required
                    /> */}
                    <TextFormInput
                      control={control}
                      name="lastName"
                      label="Last Name"
                      containerClassName="mx-0.5"
                      // fullWidth
                    />
                  </div>
                </div>
              </>
            )}

            <div className="space-y-2">
              {/* <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                name="email"
                onChange={handleFormChange}
                required
              /> */}
              <TextFormInput
                control={control}
                name="email"
                label="Email"
                containerClassName="mx-0.5"
                // fullWidth
              />
            </div>

            <div className="space-y-2">
              {/* <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                name="password"
                onChange={handleFormChange}
                required
                minLength={6}
              /> */}
              <TextFormInput
                control={control}
                name="password"
                label="Password"
                containerClassName="mx-0.5"
                // fullWidth
              />
            </div>

            <Button
              type="submit"
              className="w-full cursor-pointer"
              disabled={loading}
            >
              {loading ? "Please wait..." : isLogin ? "Sign In" : "Sign Up"}
            </Button>
          </form>

          {/* <form onSubmit={handleSubmit(submitHandler)}>
            <TextFormInput
              control={control}
              name="firstName"
              label="First Name"
              containerClassName="mx-0.5"
              fullWidth
            />
            <TextFormInput
              control={control}
              name="firstName"
              label="First Name"
              containerClassName="mx-0.5"
              fullWidth
            />
            <button type="submit">Submit</button>
          </form> */}

          {/* <form onSubmit={handleEmailAuth} className="space-y-4">
            {!isLogin && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      placeholder="John"
                      value={formData.firstName}
                      name="firstName"
                      onChange={handleFormChange}
                      required
                    />
                    {/* <TextFormInput
                  control={control}
                  name='name'
                  label="Name"
                  containerClassName="mx-0.5"
                  fullWidth
                /> 
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      placeholder="Doe"
                      value={formData.lastName}
                      name="lastName"
                      onChange={handleFormChange}
                      required
                    />
                  </div>
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                name="email"
                onChange={handleFormChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                name="password"
                onChange={handleFormChange}
                required
                minLength={6}
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Please wait..." : isLogin ? "Sign In" : "Sign Up"}
            </Button>
          </form> */}

          <div className="text-center">
            <Button
              variant="link"
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm cursor-pointer"
            >
              {isLogin
                ? "Don't have an account? Sign up"
                : "Already have an account? Sign in"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
