import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon } from "lucide-react";
import { addDays, format } from "date-fns";
import { cn, getExpiryDate } from "@/lib/utils";
import { CertificateItems } from "./certificate-items";
import { useContext } from "react";
import { UserContext } from "@/components/layout";
import { HomeCertificate } from "@/lib/types";

const AchievementSchema = z.object({
  certificateName: z.string({ required_error: "Certificate is required." }),
  certifiedDate: z.date({ required_error: "Certified date is required." }),
  expiryDate: z.date({ required_error: "Expiry date is required." }),
});

export function ModifyAchievementForm({
  achievement,
  triggerRefresh,
}: {
  achievement: HomeCertificate;
  triggerRefresh: () => Promise<void>;
}) {
  const form = useForm<z.infer<typeof AchievementSchema>>({
    resolver: zodResolver(AchievementSchema),
    defaultValues: {
      certificateName: achievement.certification,
      certifiedDate: new Date(achievement.certifiedDate),
      expiryDate: getExpiryDate(
        achievement.certificateLevel,
        achievement.certifiedDate,
        achievement.expiryDate,
      ),
    },
  });
  const { user } = useContext(UserContext);

  async function onSubmit(data: z.infer<typeof AchievementSchema>) {
    const payload = {
      ...data,
      id: achievement.id,
      employeeId: user,
      employee: null,
      certificate: null,
    };

    console.log(payload);

    await fetch(`achievement/${achievement.id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
      },
    });
    await triggerRefresh();
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        <div className="flex flex-col justify-center gap-8">
          <FormField
            control={form.control}
            name="certificateName"
            render={({ field }) => (
              <FormItem className="flex flex-col space-y-2 w-full">
                <FormLabel>Certificate</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue
                        defaultValue={field.value}
                        placeholder={
                          field.value ? field.value : "Select certificate"
                        }
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="max-h-[var(--radix-select-content-available-height)]">
                    <CertificateItems />
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="certifiedDate"
            render={({ field }) => (
              <FormItem className="flex flex-col space-y-2 w-full">
                <FormLabel>Certified Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[240px] pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => {
                        return (
                          date > new Date() || date < addDays(new Date(), -365)
                        );
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="expiryDate"
            render={({ field }) => (
              <FormItem className="flex flex-col space-y-2 w-full">
                <FormLabel>Expiry Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[240px] pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => {
                        const newDate = new Date(date);
                        newDate.setDate(date.getDate() + 1);
                        return (
                          newDate < new Date() ||
                          date > addDays(new Date(), 365)
                        );
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction type="submit">Submit</AlertDialogAction>
        </AlertDialogFooter>
      </form>
    </Form>
  );
}
