import { useCallback } from "preact/hooks";
import { Button } from "../components/Button.tsx";

interface AuthenticateProps {
  client_id: string;
  redirect_uri: string;
}

export default function Authenticate(props: AuthenticateProps) {
  const { client_id, redirect_uri } = props;

  const handleAuthenticate = useCallback(() => {
    const rootURl = "https://github.com/login/oauth/authorize";

    const options = {
      client_id,
      redirect_uri,
      scope: "user:email",
      state: location.href,
    };

    location.href = `${rootURl}?${new URLSearchParams(options).toString()}`;
  }, []);

  return (
    <div class="flex gap-2 w-full">
      <Button
        class={"inline-block rounded-lg border px-4 py-1.5 text-base font-semibold shadow-sm w-full"}
        onClick={handleAuthenticate}
      >
        sign in with github
      </Button>
    </div>
  );
}
