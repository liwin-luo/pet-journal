/** 出图和文字各自一个接口。新增一家供应商就加一个文件，在 adapt.ts 登记名字。 */
export interface StillProvider {
  readonly name: string;
  still(prompt: string, refs: string[]): Promise<string>;
}

export interface ChatProvider {
  readonly name: string;
  chat(prompt: string): Promise<string>;
}
