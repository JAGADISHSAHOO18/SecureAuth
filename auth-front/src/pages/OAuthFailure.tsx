import { Link } from "react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function OAuthFailure() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
      <Card className="w-full max-w-md text-center">
        <CardContent className="p-8">
          <h1 className="text-2xl font-bold">Authentication failed</h1>
          <p className="mt-2 text-muted-foreground">
            The external identity provider could not complete the login.
          </p>
          <Link to="/login"><Button className="mt-6">Back to login</Button></Link>
        </CardContent>
      </Card>
    </div>
  );
}
