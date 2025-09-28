'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { CheckboxField } from '@/components/forms/CheckboxField'
import { DateField } from '@/components/forms/DateField'
import { MultiSelectField } from '@/components/forms/MultiSelectField'
import { SelectField } from '@/components/forms/SelectField'
import { Button } from '@/components/ui/button'
import { Form, FormField } from '@/components/ui/form'
import { intervals } from '@/features/kpiTable/constants'
import { useKpiContext } from '@/features/kpiTable/context/KpiContext'
import { GET_KPI } from '@/features/kpiTable/graphql/queries'
import { useCurrencies } from '@/features/kpiTable/hooks/useCurrencies'
import { formSchema } from '@/features/kpiTable/zod/formSchema'
import { useLazyQuery } from '@apollo/client/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Flex } from '@radix-ui/themes'
import { z } from 'zod'

export const KpiForm = () => {
  const { currencies, errorCurrencies } = useCurrencies()
  const [fetchKpi, { data: kpiRows, refetch }] = useLazyQuery(GET_KPI)
  const { setVariables, setAutoRefresh, requestTime, setRequestTime } = useKpiContext()
  const [isRequesting, setIsRequesting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  })

  const onAutoRefreshChange = (autoRefresh: boolean) => {
    setAutoRefresh(autoRefresh)
  }

  const onSubmit = async (formData: z.infer<typeof formSchema>) => {
    const variables = {
      from: formData.from.toISOString(),
      to: formData.to.toISOString(),
      interval: formData.interval,
      currencies: formData.currencies,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    }
    setVariables(variables)
    setIsRequesting(true)
    const requestStart = Date.now()
    if (kpiRows) {
      await refetch(variables)
    } else {
      await fetchKpi({ variables })
    }
    setRequestTime(Date.now() - requestStart)
    setIsRequesting(false)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Flex gap="4">
          <FormField
            control={form.control}
            name="from"
            render={({ field, fieldState: { error } }) => (
              <DateField {...field} className="w-[192px]" error={error?.message} label="Начало периода" />
            )}
          />
          <FormField
            control={form.control}
            name="to"
            render={({ field, fieldState: { error } }) => (
              <DateField {...field} className="w-[192px]" error={error?.message} label="Конец периода" />
            )}
          />
          <FormField
            control={form.control}
            name="interval"
            render={({ field, fieldState: { error } }) => (
              <SelectField
                {...field}
                className="w-[192px]"
                error={error?.message}
                label="Интервал"
                options={intervals}
                placeholder="Выберите интервал"
              />
            )}
          />
          <FormField
            control={form.control}
            name="currencies"
            render={({ field, fieldState: { error } }) => (
              <MultiSelectField
                {...field}
                className="w-[192px]"
                error={error?.message || errorCurrencies?.message}
                hideSelectAll
                label="Валюта"
                options={currencies}
                placeholder="Выберите валюту"
                value={field.value || []}
              />
            )}
          />

          <CheckboxField className="mt-6 h-[38px] w-[192px]" label="Auto refresh (5s)" onChange={onAutoRefreshChange} />
        </Flex>
        <Flex className="mt-4" gap="4">
          <Button disabled={isRequesting} type="submit">
            Запросить данные
          </Button>
          {!!requestTime && (
            <p className="text-sm text-muted-foreground flex items-center">Время запроса: {requestTime} ms</p>
          )}
        </Flex>
      </form>
    </Form>
  )
}
