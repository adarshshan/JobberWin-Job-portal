import React, { useEffect, useState } from 'react'
import { Box, Button, Stack, Text, Toast } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import GroupChatModel from './GroupChatModel';
import { getSender } from 'config/chatLogics';
import ChatLoading from './ChatLoading';
import { ChatState } from 'Context/ChatProvider';
import { fetchChat } from 'Api/chat';


interface IMyChats {
    fetchAgain: boolean;
}
const Mychats: React.FC<IMyChats> = ({ fetchAgain }) => {
    const [loggedUser, setLoggedUser] = useState();

    const { selectedChat, setSelectedChat, userr, chats, setChats } = ChatState();

    const fetchChats = async () => {
        try {
            const res = await fetchChat();
            console.log(res);
            if (res?.data.success) {
                setChats(res.data.data);
            } else console.log(res?.data.message);


        } catch (error) {
            console.log(error)
            Toast({
                title: "Error Occured",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "top-left",
            });
        }
    };

    useEffect(() => {
        setLoggedUser(JSON.parse(localStorage.getItem("userAddress") as string));
        fetchChats();
    }, [fetchAgain]);
    return (
        <Box
            display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
            flexDir="column"
            alignItems="center"
            p={3}
            bg="white"
            w={{ base: "100%", md: "31%" }}
            borderRadius="lg"
            borderWidth="1px" >
            <Box
                pb={3}
                px={3}
                fontSize={{ base: "28px", md: "30px" }}
                fontFamily="Work sans"
                display="flex"
                w="100%"
                justifyContent="space-between"
                alignItems="center"
            >
                My Chats
                <GroupChatModel>
                    <Button
                        display="flex"
                        fontSize={{ base: "17px", md: "10px", lg: "17px" }}
                        rightIcon={<AddIcon />}
                    >
                        New Group Chat
                    </Button>
                </GroupChatModel>
            </Box>
            <Box
                display="flex"
                flexDir="column"
                p={3}
                bg="#F8F8F8"
                w="100%"
                h="100%"
                borderRadius="lg"
                overflowY="hidden">
                {chats ? (
                    <Stack overflowY="scroll">
                        {chats.map((chat: any) => (
                            <Box
                                onClick={() => setSelectedChat(chat)}
                                cursor="pointer"
                                bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                                color={selectedChat === chat ? "white" : "black"}
                                px={3}
                                py={2}
                                borderRadius="lg"
                                key={chat._id}
                            >
                                <Text>
                                    {!chat.isGroupChat
                                        ? getSender(loggedUser, chat.users)
                                        : chat.chatName}
                                </Text>
                                {chat.latestMessage && (
                                    <Text fontSize="xs">
                                        <b>{chat.latestMessage.sender.name} : </b>
                                        {chat.latestMessage.content.length > 50
                                            ? chat.latestMessage.content.substring(0, 51) + "..."
                                            : chat.latestMessage.content}
                                    </Text>
                                )}
                            </Box>
                        ))}
                    </Stack>
                ) : (
                    <ChatLoading />
                )}
            </Box>

        </Box>
    )
}

export default Mychats
