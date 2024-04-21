"use server";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { DocxLoader } from "langchain/document_loaders/fs/docx";
import fs from "fs";
import { embeddAndStoreData } from "./vector-actions";
import { create_model } from "@/models/prompt_structure";

export const getDataViaFiles = async () => {
  try {
    const directoryPath = "files";
    const files = fs.readdirSync(directoryPath);

    let loader;
    files.forEach(async (file) => {
      let doc_data = "";
      if (file.split(".")[1] === "pdf") {
        loader = new PDFLoader(`files/${file}`);
      } else {
        loader = new DocxLoader(`files/${file}`);
      }
      const docs = await loader.load();

      //   embeddAndStoreData(docs);

      //   console.log("Embedding done!");
      for (let index = 0; index < docs.length; index++) {
        doc_data += `. Document Name - ${file}  ${
          file.split(".")[1] === "pdf"
            ? ", Page " + docs[index].metadata.loc.pageNumber
            : ""
        }  - ${docs[index].pageContent.replaceAll("\n", "")}`;
      }
      doc_data += "\n";
      console.log(file, doc_data.length);

      // const { exec } = require("child_process");

      // const res = fs.writeFileSync(
      //   `models/${file.replaceAll(" ", "").split(".")[0]}AiModelFile`,
      //   create_model(doc_data)
      // );

      // console.log(res);

      // exec(
      //   `ollama create ${
      //     file.replaceAll(" ", "").split(".")[0]
      //   }AiModelFile -f models/${
      //     file.replaceAll(" ", "").split(".")[0]
      //   }AiModelFile`,
      //   (error: any, stdout: string, stderr: string) => {
      //     if (error) {
      //       console.error(error);
      //       return;
      //     }
      //     console.log(stdout);
      //   }
      // );

      // fs.appendFile("test_data.txt", doc_data, (err) => {
      //   if (err) {
      //     console.error(err);
      //     return;
      //   }
      //   console.log("The data was written to the file successfully.");
      // });
      // const data = fs.readFileSync("test_data.txt", "utf8");
      // const new_data = new Set(data.split("\n"));
      // fs.writeFileSync("test_data.txt", Array.from(new_data).join("\n"));
    });

    // await fs.readFile("test_data.txt", (err, data) => {
    //   if (!err) {
    //     console.log(err);
    //   } else {
    //     const new_data = new Set(data.toString().split("\n"));
    //     fs.writeFile(
    //       "test_data.txt",
    //       Array.from(new_data).join("\n"),
    //       (err) => {
    //         if (!err) {
    //           console.log("successfully written");
    //         }
    //       }
    //     );
    //   }
    // });
  } catch (error) {
    // console.log(error);
  }
};
