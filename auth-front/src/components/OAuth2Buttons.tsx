import { Button } from "@/components/ui/button";
import { Chrome, Github } from "lucide-react";

const backendBaseUrl =
  import.meta.env.VITE_BACKEND_BASE_URL || "http://localhost:8082";

export default function OAuth2Buttons() {
  return (
    <div className="space-y-3">
      <a href={`${backendBaseUrl}/oauth2/authorization/google`} className="block">
        <Button type="button" variant="outline" className="w-full">
          <Chrome className="h-4 w-4" />
          Continue with Google
        </Button>
      </a>
      <a href={`${backendBaseUrl}/oauth2/authorization/github`} className="block">
        <Button type="button" variant="outline" className="w-full">
          <Github className="h-4 w-4" />
          Continue with GitHub
        </Button>
      </a>
    </div>
  );
}
