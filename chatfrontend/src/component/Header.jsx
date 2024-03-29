import { Flex } from "@radix-ui/themes";

export default function Header() {
  return (
    <Flex
      gap={"4"}
      align={"center"}
      justify={"between"}
      className="p-[2rem] py-[4rem]"
    >
      <div className="text-2xl text-[#fff] text-[4rem] font-bold">
        Chat  Messager
      </div>
      <w3m-button />
    </Flex>
  );
}
