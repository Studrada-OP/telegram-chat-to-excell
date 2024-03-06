type TextEntries = {
  type: string;
  text: string;
};

export type Message = {
  id: number;
  type: string;
  date: string;
  date_unixtime: number;
  from: string;
  from_id: string;
  text: string;
  action: string;
  title: string;
  reply_to_message_id: number;
  text_entities: TextEntries[];
};
