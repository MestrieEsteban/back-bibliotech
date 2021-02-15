/* eslint-disable @typescript-eslint/no-explicit-any */
type RepsonseOk = {
  data: {
    [name: string]: any
    meta: any
  }
}
type RepsonseOkNoJson = {
  data: {
    [name: string]: any
  }
}

type ResponseKo = {
  err: {
    status: number
    code: string
    description: string
  }
}

export function success(resource: any, meta: any = {}): RepsonseOk {
  const name = resource.constructor.name
  return { data: { [name.toLowerCase()]: resource.toJSON(), meta } }
}

export function successNoJson(name: string, resource: any): RepsonseOkNoJson {
  return { data: { [name.toLowerCase()]: resource } }
}

export function error({ status, code }: { status: number; code: string }, err: any): ResponseKo {
  const description = err.detail ? err.detail : err.message

  return {
    err: {
      status,
      code,
      description,
    },
  }
}
