import { redirect } from "next/navigation";

type AuthLoginPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AuthLoginPage({ searchParams }: AuthLoginPageProps) {
  const params = await searchParams;
  const error = Array.isArray(params.error) ? params.error[0] : params.error;
  const query = error ? `?error=${encodeURIComponent(error)}` : "";

  redirect(`/sign-in${query}`);
}
