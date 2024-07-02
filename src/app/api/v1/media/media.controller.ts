import mime from 'mime-types';
import { Hono } from "hono";
import { MakeError, MakeQueryError } from "../[[...route]]/route";
import { createNewMedia } from "./media.service";
import bytes from 'bytes';

const app = new Hono<{ Variables: any }>()

app.post('/upload', async (c) => {
  try {
    const { file, bucket }: any = await c.req.parseBody()
    console.log("🚀 ~ app.post ~ file:", file)

    if (!file || !(file instanceof File)) MakeError(400, 'FAILED_UPLOAD', 'Masukan file dengan benar.')
    if (!/^image|video/.test(file.type)) MakeError(400, 'FAILED_UPLOAD', 'File tidak di dukung, ulangi lagi.');
    if (!/^image|video/.test(mime.lookup(file.name).toString())) MakeError(400, 'FAILED_UPLOAD', 'File tidak di dukung, ulangi lagi.');
    if (file.size > Number(bytes('20MB'))) MakeError(400, 'FAILED_UPLOAD', 'Media tidak boleh lebih dari 20MB.');
    if (!/^posts|comments/.test(bucket)) MakeQueryError()

    const create = await createNewMedia({ file: file as any, bucket })

    return c.json({ data: create })
  } catch (error: any) {
    return c.get('ParseError')(error)
  }
})


export { app as MediaController };
