import { useState, useEffect } from 'react'
import { supabase } from '../services/supabaseClient'

export const useUserPlan = (user) => {
    const [plan, setPlan] = useState('free')
    const [loading, setLoading] = useState(true)
    const [features, setFeatures] = useState({
        maxResumes: 1,
        canDownloadPDF: true,
        canRemoveBranding: false,
        isPremium: false
    })

    useEffect(() => {
        if (!user) {
            setLoading(false)
            return
        }

        const fetchPlan = async () => {
            try {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('plan_tier')
                    .eq('id', user.id)
                    .single()

                if (error) throw error

                const tier = data?.plan_tier || 'free'
                setPlan(tier)

                // Define feature flags based on tier
                // 'lifetime', 'yearly', 'monthly' are considered premium
                const isPremium = ['lifetime', 'yearly', 'monthly'].includes(tier)

                setFeatures({
                    maxResumes: isPremium ? 999 : 2, // Free: 2, Premium: Unlimited (999)
                    canDownloadPDF: true,
                    canRemoveBranding: isPremium,
                    isPremium
                })

            } catch (error) {
                console.error('Error fetching user plan:', error)
                // Fallback to free
            } finally {
                setLoading(false)
            }
        }

        fetchPlan()
    }, [user])

    return { plan, loading, features }
}
