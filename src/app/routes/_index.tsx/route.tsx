import { LoaderFunction, MetaFunction, redirect } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    {
      title: `Orascify - Home`,
      description: "A clockify inspired app.",
    },
  ];
};

// export const loader: LoaderFunction = async ({ request }) => {
//   const { user, headers } = await getUser(request);

//   if (!user) {
//     return redirect("/signin");
//   }

//   return redirect("/dashboard", { headers });
// };
