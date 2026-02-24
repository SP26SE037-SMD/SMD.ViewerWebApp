import { redirect } from "next/navigation";

export default function Home() {
  // if (!isAuth) {
  //   redirect("/login");
  // }
  redirect("/login");

  return <main></main>;
}
