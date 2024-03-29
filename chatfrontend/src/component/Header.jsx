import { Flex } from "@radix-ui/themes";

export default function Header() {
  return (
    <Flex
      gap={"4"}
      align={"center"}
      justify={"between"}
      className=" py-[4rem]"
    >
      <div className="text-2xl text-[#888] text-[4rem] font-bold">
        Chat Messager
      </div>
      <w3m-button />
    </Flex>
  );
}
