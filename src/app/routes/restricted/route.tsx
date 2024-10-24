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
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <Alert variant="destructive" className="w-[400px]">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Access Denied</AlertTitle>
        <AlertDescription className="mt-2">
          You don't have permission to access the knowledge base. Your current
          role is: {userRole}. Please contact an administrator for access.
        </AlertDescription>
        <Button
          variant="outline"
          className="mt-4 w-full hover:text-red-500"
          onClick={() => navigate("/dashboard")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
      </Alert>
    </div>
  );
}
