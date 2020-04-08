export declare enum ConversationStatus {
    Assigned = "assigned",
    New = "new",
    Resolved = "resolved"
}
export declare enum ChangedStatus {
    Assign = "ASSIGN",
    New = "NEW",
    Resolve = "RESOLVE"
}
export declare enum MessageType {
    Normal = "normal",
    Private = "private",
    System = "system"
}
export declare enum ActorType {
    Agent = "agent",
    System = "system",
    User = "user"
}
export declare enum ResponseDueType {
    FirstResponseDue = "FIRST_RESPONSE_DUE",
    NoResponseDue = "NO_RESPONSE_DUE",
    ResponseDue = "RESPONSE_DUE"
}
export interface Group {
    description: string;
    id: string;
    name: string;
    routing_type: string;
}
export interface Channel {
    enabled: boolean;
    icon: object;
    id: string;
    locale: string;
    name: string;
    public: boolean;
    updated_time: string;
    welcome_message: Message;
}
export interface UserProperty {
    name: string;
    value: string;
}
export interface User {
    avatar?: {
        url?: string;
    };
    created_time: string;
    email?: string;
    first_name?: string;
    id: string;
    last_name?: string;
    phone?: string;
    properties?: UserProperty[];
}
export interface MessagePart {
    callback?: {
        label: string;
        payload: string;
    };
    collection?: {
        sub_parts: MessagePart[];
    };
    image?: {
        url: string;
    };
    quick_reply_button?: {
        custom_reply_text?: string;
        label: string;
    };
    text?: {
        content: string;
    };
    url_button?: {
        label: string;
        target: string;
        url: string;
    };
}
export interface ReplyPart {
    collection: {
        sub_parts: MessagePart[];
    };
}
export interface Actor {
    avatar: {
        url: string;
    };
    email: string;
    first_name: string;
    id: string;
    last_name: string;
    phone: string;
    type: ActorType;
}
export interface Message {
    actor_id: string;
    actor_type: ActorType;
    app_id: string;
    channel_id: string;
    conversation_id: string;
    created_time: string;
    id: string;
    message_parts: MessagePart[];
    message_type: MessageType;
    reply_parts: ReplyPart[];
}
export interface ModelProperties {
    app_id: string;
    assigned_agent_id: string;
    assigned_group_id: string;
    assigned_time: string;
    channel_id: string;
    conversation_id: string;
    created_time: string;
    messages: Message[];
    reopened_time: string;
    response_due_type: ResponseDueType;
    status: ConversationStatus;
    user_id: string;
}
export interface Agent {
    avatar: object;
    email: string;
    first_name: string;
    id: string;
    last_name: string;
}
export interface ProductEventData {
    actor: Actor;
    associations: {
        agent: Agent;
        channel: Channel;
        group: Group;
        user: User;
    };
    changes: {
        model_changes: {
            assigned_agent_id: [string, string];
            assigned_group_id: [string, string];
            status: [ChangedStatus, ChangedStatus];
        };
    };
    conversation: ModelProperties;
    message: ModelProperties;
}
