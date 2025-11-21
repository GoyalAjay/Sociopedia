import { useEffect, useState } from "react";
import { getSocket } from "../socket/socket";
import { useUpdateRequestMutation, useGetRequestsQuery } from "../slices/userApi";
import { useRequestStore } from "../slices/requestStore";

export default function useFriendRequests({userId} = {}){
    const [requests, setRequests] = useState([])
    const outgoing = useRequestStore((state) => state.outgoing);
    const incoming = useRequestStore((state) => state.incoming);
    const addAccepted = useRequestStore((state) => state.addAccepted);
    const setOutgoing = useRequestStore((state) => state.setOutgoing)
    const setIncoming = useRequestStore((state) => state.setIncoming)
    const removeAccepted = useRequestStore((state) => state.removeAccepted)
    const removeIncoming = useRequestStore((state) => state.removeIncoming)
    const removeOutgoing = useRequestStore((state) => state.removeOutgoing)

    const socket = getSocket();

    let { data, refetch, isLoading, error } = useGetRequestsQuery()
    let [updateRequest, {isSuccess, error: updateError}] = useUpdateRequestMutation();

    useEffect(() => {
        refetch(); // triggers API call on mount
    }, [refetch]);

    useEffect(() => {
        if (data?.success) {
            setRequests(data.requests || []);
        }
    }, [data]);

    useEffect(() => {
        const onNewRequest = (data) => {
            if(!data) return;
            console.log(data)
            if(data.status === 'incoming') {
                setRequests(prev => [...prev, data]);
                setIncoming(data.whoSend, {
                    name: data.senderName,
                    profilePic: data.senderPic
                })
                // setIncoming(prev => [...prev, data.whoSend])
            };

            if(data.status === 'outgoing'){
                setOutgoing(data.toWhom, {
                    name: data.targetName,
                    profilePic: data.targetPic
                })
            }
        }

        socket.on("friendRequest", onNewRequest);

        return () => socket.off("friendRequest", onNewRequest);
    }, [socket])

    console.log({outgoing, incoming})

    useEffect(() => {
        const onUpdatedList = (data) => {
            if(!data) return;
            addAccepted(data.friend?._id, {
                name: data.friend.name,
                profilePic: data.friend.profilePic
            })
            // setAccepted(() => data.friends)

            if(data.toWhom) removeOutgoing(data.toWhom)
            if(data.whoSend) removeIncoming(data.whoSend)
            // setOutgoing(prev => prev.filter(id => id !== data.toWhom ))
            // setIncoming(prev => prev.filter(id => id !== data.whoSend))
        }

        socket.on("updatedFriendList", onUpdatedList);

        return () => socket.off("updatedFriendList", onUpdatedList);
    }, [socket])

    const handleAccept = async(id) => {
        const data = {isAccepted: true};
        const response = await updateRequest({id, data}).unwrap();
        if(response.success){
            setRequests((prev) => prev.filter(req => req.id !== id && req._id !==id))
        }
    }

    const handleRemove = async(id) => {
        const data = {isRemovedFromUI: true}
        const response = await updateRequest({id, data}).unwrap();
        if(response.success){
            setRequests((prev) => prev.filter((req) => req.id !== id && req._id !==id))
        }
    }

    return {
        requests,
        handleAccept,
        handleRemove
    }
}