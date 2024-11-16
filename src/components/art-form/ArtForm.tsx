import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { artFormSchema } from "@/schema/validationSchema";
import ImageCaptureInput from "./ImageCaptureInput";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

const ArtForm: React.FC = () => {
  const form = useForm<z.infer<typeof artFormSchema>>({
    resolver: zodResolver(artFormSchema),
    defaultValues: {
      artImage: undefined,
      artName: "",
      artistName: "",
      description: "",
    },
  });

  const [isFormReset, setIsFormReset] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const { isSubmitting } = form.formState;

  const onSubmit = async (values: z.infer<typeof artFormSchema>) => {
    const formData = new FormData();
    const id = uuidv4();

    formData.append("id", id);
    formData.append("artName", values.artName);
    formData.append("artistName", values.artistName);
    formData.append("description", values.description);

    if (values.artImage) {
      formData.append("artImage", values.artImage, `${id}.png`);
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/postArt`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (response.ok) {
        form.reset();
        setIsFormReset(true);
        toast({
          title: "Artwork submitted successfully!",
          description: "Your artwork has been added to the gallery.",
        });
        navigate("/arts");
      } else {
        throw new Error("Failed to submit artwork");
      }
    } catch (error) {
      form.reset();
      setIsFormReset(true);
      toast({
        title: "Error",
        description:
          "Failed to submit artwork. Art will be submitted once you are back online.",
        variant: "destructive",
      });
    }
  };

  const handleImageCapture = (file: File | null) => {
    if (file) {
      form.setValue("artImage", file);
    } else {
      form.resetField("artImage");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="artImage"
          render={() => (
            <FormItem>
              <FormControl>
                <ImageCaptureInput
                  isFormReset={isFormReset}
                  onImageCapture={handleImageCapture}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="artName"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Name of Art" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="artistName"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Name of Artist" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea placeholder="Description of the art" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting}>
          Submit
        </Button>
      </form>
    </Form>
  );
};

export default ArtForm;
