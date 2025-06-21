'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import {
    Card,
    CardContent,
} from '@/components/ui/card'
import {
    Input
} from '@/components/ui/input'
import {
    Label
} from '@/components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { cn } from '@/lib/utils'
import { CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
import { Calendar } from './ui/calendar'

const formSchema = z.object({
    name: z.string().min(1, "Name is required"),
    gender: z.enum(['Male', 'Female', 'Other']),
    birthday: z.string().min(1, "Birthday is required"),
    height: z.string().min(1, "Height is required"),
    weight: z.string().min(1, "Weight is required"),
})

type FormData = z.infer<typeof formSchema>

export default function AboutForm() {
    const [error, setError] = useState("")
    const [success, setSuccess] = useState(false)
    const [date, setDate] = React.useState<Date>()
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(formSchema),
        mode: "onChange"
    })

    const onSubmit = async (data: FormData) => {
        setError("")
        setSuccess(false)

        try {
            const token = localStorage.getItem("token")

            if (!token) {
                setError("Authentication required")
                return
            }

            await axios.post("https://techtest.youapp.ai/api/updateProfile", data, {
                headers: {
                    "x-access-token": token
                }
            })

            setSuccess(true)
        } catch (err) {
            if (axios.isAxiosError(err) && err.response?.data?.message) {
                setError(err.response.data.message)
            } else {
                setError("Failed to update profile")
            }
        }
    }

    return (
        <Card className="bg-card text-white ">
            <CardContent className="p-6 space-y-4">
                {error && <div className="text-red-500 text-sm">{error}</div>}
                {success && <div className="text-green-500 text-sm">Profile updated successfully!</div>}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-12 items-center gap-0">
                        <Label className="col-span-5">Display name:</Label>
                        <div className="col-span-7 fluid">
                            <Input placeholder="Enter name" {...register('name')} />
                            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                        </div>
                    </div>

                    <div>
                        <Label>Gender:</Label>
                        <Select onValueChange={(value) => setValue('gender', value as 'Male' | 'Female' | 'Other')}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Gender" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Male">Male</SelectItem>
                                <SelectItem value="Female">Female</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender.message}</p>}
                    </div>

                    <div>
                        <Label>Birthday:</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-[240px] justify-start text-left font-normal",
                                        !date && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon />
                                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={date}
                                    onSelect={setDate}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>

                    <div className="grid grid-cols-12 items-center gap-2">
                        <Label className="col-span-5">Height:</Label>
                        <div className="col-span-7 relative">
                            <Input placeholder="Add height" {...register('height')} className="pr-8" />
                            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">cm</span>
                            {errors.height && <p className="text-red-500 text-xs mt-1">{errors.height.message}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-12 items-center gap-2">
                        <Label className="col-span-5">Weight:</Label>
                        <div className="col-span-7 relative">
                            <Input placeholder="Add weight" {...register('weight')} className="pr-8" />
                            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">kg</span>
                            {errors.weight && <p className="text-red-500 text-xs mt-1">{errors.weight.message}</p>}
                        </div>
                    </div>


                    {/* <Button
                        type="submit"
                        className="w-full"
                        disabled={loading || !isValid}
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
                    </Button> */}
                </form>
            </CardContent>
        </Card>
    )
}
