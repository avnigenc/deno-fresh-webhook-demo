import { useCallback } from "preact/hooks";
import { Button } from "../components/Button.tsx";

interface AuthenticateProps {
  client_id: string;
  redirect_uri: string;
}

export default function Authenticate(props: AuthenticateProps) {
  const { client_id, redirect_uri } = props;

  const call = useCallback(() => {
    const rootURl = "https://github.com/login/oauth/authorize";

    const options = {
      client_id,
      redirect_uri,
      scope: "user:email",
      state: location.href,
    };

    const qs = new URLSearchParams(options);

    location.href = `${rootURl}?${qs.toString()}`;
  }, []);

  return (
    <div class="flex gap-2 w-full">
      <Button
        class={"inline-block rounded-lg border px-4 py-1.5 text-base font-semibold shadow-sm w-full"}
        onClick={call}
      >
        sign in with github
      </Button>
    </div>
  );
}