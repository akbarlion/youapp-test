'use client'
import axios from "axios"
import { useState } from "react"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { useRouter } from "next/navigation"

export default function InterestForm() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState(false)
    const [interests, setInterests] = useState<string[]>([])
    const [inputValue, setInputValue] = useState("")
    const router = useRouter()


    const handleAddInterest = () => {
        if (inputValue.trim() !== "") {
            setInterests([...interests, inputValue.trim()])
            setInputValue("")
        }
    }

    const handleRemoveInterest = (index: number) => {
        const newInterests = [...interests]
        newInterests.splice(index, 1)
        setInterests(newInterests)
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault()
            handleAddInterest()
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")
        setSuccess(false)

        try {
            const token = localStorage.getItem("token")

            if (!token) {
                setError("Authentication required")
                return
            }

            await axios.put("https://techtest.youapp.ai/api/updateProfile", {
                interests: interests
            },
                {
                    headers: {
                        "x-access-token": token
                    }
                });

            setTimeout(() => {
                router.push('/dashboard')
            }, 1500) // Delay 1.5 detik agar user bisa melihat pesan sukses

        } catch (err) {
            if (axios.isAxiosError(err) && err.response?.data?.message) {
                setError(err.response.data.message)
            } else {
                setError("Failed to update interests")
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="p-6 bg-[#D9D9D90F]/30 backdrop-blur-md rounded-xl text-white">
            {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
            {success && <div className="text-green-500 text-sm mb-4">Interests updated successfully!</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <div className="flex gap-2 mb-2">
                        <Input
                            placeholder="Type an interest and press Enter"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="w-full"
                        />
                        <Button
                            type="button"
                            onClick={handleAddInterest}
                            className="shrink-0"
                        >
                            Add
                        </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">Press Enter or comma to add an interest</p>
                </div>

                <div className="flex flex-wrap gap-2 min-h-[100px] p-3 border border-dashed rounded-md">
                    {interests.length > 0 ? (
                        interests.map((interest, index) => (
                            <div key={index} className="bg-[#FFFFFF1A] px-3 py-1 flex items-center gap-1">
                                <span>{interest}</span>
                                <button
                                    type="button"
                                    onClick={() => handleRemoveInterest(index)}
                                    className="text-xs hover:text-red-500 ml-2"
                                >
                                    ✕
                                </button>
                            </div>
                        ))
                    ) : (
                        <p className="text-muted-foreground text-sm">No interests added yet</p>
                    )}
                </div>


                <Button
                    type="submit"
                    className="w-full"
                    disabled={loading || interests.length === 0}
                >
                    {loading ? (
                        <div className="flex items-center gap-2">
                            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>Updating...</span>
                        </div>
                    ) : "Save & Update"}
                </Button>
            </form>
        </div>
    )
}
