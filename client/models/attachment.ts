export default interface attachment {
    attachmentid: number,
    threadid: number,
    messageid: number,
    filename: string,
    mimetype: string,
    size: number,
    createddate: Date
}