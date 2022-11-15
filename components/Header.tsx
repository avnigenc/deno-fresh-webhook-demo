import LemonIcon from "https://deno.land/x/tabler_icons_tsx@0.0.1/tsx/lemon-2.tsx";

type Props = {
  active?: string;
  isAuthenticated: boolean;
};

export function Header({ active, isAuthenticated = false }: Props) {
  const menus = [
    { name: "home", href: "/" },
    { name: "about", href: "/about" },
    { name: "logout", href: "/logout", hide: !isAuthenticated },
  ];

  return (
    <div class="bg-white w-full max-w-screen py-6 px-8 flex flex-col md:flex-row gap-4">
      <div class="flex items-center flex-1">
        <LemonIcon />
        <div class="text-2xl  ml-1 font-bold">
          webhook manager
        </div>
      </div>
      <ul class="flex items-center justify-end gap-6">
        {menus.filter((menu) => !menu.hide).map((menu) => (
          <li>
            <a
              href={menu.href}
              class={"text-gray-500 hover:text-gray-700 py-1 border-gray-500" +
                (menu.href === active ? " font-bold border-b-2" : "")}
            >
              {menu.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
