import { getEnv } from '@/helpers/getEnv';
import { showToast } from '@/helpers/showToast';
import { useFetch } from '@/hooks/useFetch';
import React, { useEffect, useState } from 'react'
import { FaRegHeart } from "react-icons/fa";
import { useSelector } from 'react-redux';
import { FaHeart } from "react-icons/fa";

const LikeCount = ({ props }) => {
    const [likeCount, setLikeCount] = useState(0)
    const [hasLiked, setHasLiked] = useState(false)
    const user = useSelector(state => state.user)

    const { data: blogLikeCount, loading, error } = useFetch(`${getEnv('VITE_API_BASE_URL')}/blog-like/get-like/${props.blogid}/${user && user.isLoggedIN ? user.user._id : ''}`, {
        method: 'get',
        credentials: 'include',
    })

    useEffect(() => {
        if (blogLikeCount) {
            setLikeCount(blogLikeCount.likecount)
            setHasLiked(blogLikeCount.isUserliked)
        }
    }, [blogLikeCount])

    const handleLike = async () => {
        try {
            if (!user.isLoggedIN) {
                return showToast('error', 'Please login into your account.')
            }

            const response = await fetch(`${getEnv('VITE_API_BASE_URL')}/blog-like/do-like`, {
                method: 'post',
                credentials: 'include',
                headers: { 'Content-type': "application/json" },
                body: JSON.stringify({ user: user.user._id, blogid: props.blogid })
            })

            if (!response.ok) {
                showToast('error', response.statusText)
            }
            const responseData = await response.json()
            setLikeCount(responseData.likecount)
            setHasLiked(!hasLiked)
        } catch (error) {
            showToast('error', error.message)
        }
    }

    return (
        <button
            onClick={handleLike}
            type='button'
            className='flex justify-center items-center gap-1.5 text-sm sm:text-base text-[#4A3728] hover:text-[#D97748] transition-colors'
        >
            {!hasLiked ?
                <FaRegHeart className="text-[#8C7B6B]" />
                :
                <FaHeart className="text-[#D97748]" />
            }
            <span>{likeCount}</span>
        </button>
    )
}

export default LikeCount