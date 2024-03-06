import * as fs from "fs";
import { Message } from "./types";
import * as ExcelJS from "exceljs";

// creating workbook and creating first sheet for default topic
const workbook = new ExcelJS.Workbook();
const generalWorksheet = workbook.addWorksheet(`general`);
generalWorksheet.addRow(["id", "type", "date", "from", "from_id", "text"]);

// reading and parsing telegram chat history file
const chatHistoryJSON = fs.readFileSync("./resources/result.json", "utf8");
const chatHistory = JSON.parse(chatHistoryJSON);
const messages = chatHistory.messages as Message[];

// finding all topics and creating sheet for each of them
const topics = messages.reduce<number[]>((result, message) => {
  const isNewTopic = message.action === "topic_created";

  if (!isNewTopic) {
    return result;
  }

  const worksheet = workbook.addWorksheet(`${message.id}`);
  worksheet.addRow(["id", "type", "date", "from", "from_id", "text"]);

  result.push(message.id);
  return result;
}, []);

// adding each message into row of the required sheet
messages.map((message) => {
  const isInTopic = topics.includes(message.reply_to_message_id);
  const worksheetName = isInTopic
    ? `${message.reply_to_message_id}`
    : "general";

  const text = message.text_entities.reduce((result, currentValue) => {
    return result + currentValue.text;
  }, "");

  const worksheet = workbook.getWorksheet(worksheetName);

  worksheet.addRow([
    message.id,
    message.type,
    message.date,
    message.from,
    message.from_id,
    text,
  ]);
});

// writing workbook into file
workbook.xlsx.writeFile(`./out/${chatHistory.name}.xlsx`);
