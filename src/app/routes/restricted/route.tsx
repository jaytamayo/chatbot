import { json } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { Alert, AlertDescription, AlertTitle, Button } from "~/components/ui";
import { AlertCircle, ArrowLeft } from "lucide-react";

export const loader = async () => {
  const userRole = process.env.ROLE;

  return json({ userRole });
};

export default function Restricted() {
  const { userRole } = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-800 p-4 sm:p-6 md:p-8">
      <Alert
        variant="destructive"
        className="w-full max-w-[90%] sm:max-w-[400px] md:max-w-[450px] lg:max-w-[500px]"
      >
        <div className="flex items-center">
          <AlertCircle className="h-4 w-4 mr-2" />
          <AlertTitle className="text-lg sm:text-xl font-semibold">
            Access Denied
          </AlertTitle>
        </div>
        <AlertDescription className="mt-2 text-sm sm:text-base">
          You don't have permission to access the knowledge base. Your current
          role is: <span className="font-semibold">{userRole}</span>. Please
          contact an administrator for access.
        </AlertDescription>
        <Button
          variant="outline"
          className="mt-4 w-full hover:text-red-500 text-sm sm:text-base py-2 sm:py-3"
          onClick={() => navigate("/dashboard")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
      </Alert>
    </div>
  );
}
