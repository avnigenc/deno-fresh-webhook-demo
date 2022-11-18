import { ComponentChildren } from "preact";
import LemonIcon from "https://deno.land/x/tabler_icons_tsx@0.0.1/tsx/lemon-2.tsx";
import BrandGithub from "https://deno.land/x/tabler_icons_tsx@0.0.1/tsx/brand-github.tsx";

type Props = {
  children?: ComponentChildren;
};

export function Footer({ children }: Props) {
  const menus = [
    {
      title: "",
      children: [
        { name: "Deno.land", href: "https://deno.land/" },
        { name: "fresh", href: "https://fresh.deno.dev/" },
      ],
    },
  ];

  return (
    <div class="bg-white flex flex-col md:flex-row w-full gap-8 md:gap-16 px-8 py-8 text-sm">
      <div class="flex-1">
        <div class="flex items-center gap-1">
          <LemonIcon class="inline-block" />
          <div class="font-bold text-2xl">
            webhook manager
          </div>
        </div>
        <div class="text-gray-500">
          made with fresh
        </div>
      </div>

      {menus.map((item) => (
        <div class="mb-4" key={item.title}>
          <div class="font-bold">{item.title}</div>
          <ul class="mt-2">
            {item.children.map((child) => (
              <li class="mt-2" key={child.name}>
                <a
                  class="text-gray-500 hover:text-gray-700"
                  href={child.href}
                  target="_blank"
                >
                  {child.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}

      <div class="text-gray-500 space-y-2">
        <a
          href="https://github.com/avnigenc/deno-fresh-webhook-demo"
          class="inline-block hover:text-black"
          target="_blank"
        >
          <BrandGithub />
        </a>
      </div>
    </div>
  );
}
