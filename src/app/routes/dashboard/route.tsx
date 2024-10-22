import { type LoaderFunctionArgs } from "@remix-run/node";
import { requireUserSession } from "~/lib/auth";
import { MessageCircle, LogOut } from "lucide-react";
import { Button } from "~/components/ui";
import { Form, useNavigate } from "@remix-run/react";

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await requireUserSession(request);

  return session;
}

const Dashboard = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white rounded-full shadow-md px-4 py-2 flex items-center space-x-4">
        <Form action="/logout" method="post">
          <Button
            type="submit"
            className="focus:outline-none focus:ring-2 focus:ring-gray-300 rounded-full p-1 transition-colors duration-200"
          >
            <LogOut size={24} />
          </Button>
        </Form>

        <Button
          onClick={() => navigate("/chat")}
          className="focus:outline-none focus:ring-2 focus:ring-gray-300 rounded-full p-1 transition-colors duration-200"
        >
          <MessageCircle size={24} />
        </Button>
      </div>
    </div>
  );
};

export default Dashboard;
