interface LiteralError<Message extends string, Name extends string = 'Error'> {
    message: Message;
    name: Name;
}
