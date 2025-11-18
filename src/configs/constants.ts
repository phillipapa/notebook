import createEnumFunctions from '@/utils/createEnum'

const FilesizeConstants = createEnumFunctions.createEnumNumberValue({
    BYTES_SIZE: 1024,
    MAX_FILE_SIZE: 5 * 1024 * 1024
}, 'filesizeconstants')

const EnvironmentConstants = createEnumFunctions.createEnumStringValue({
    DEV: 'Development',
    PROD: 'Production'
}, 'environmentconstants')

export type FilesizeConstants = (typeof FilesizeConstants)[keyof typeof FilesizeConstants];
export type EnvironmentConstants = (typeof EnvironmentConstants)[keyof typeof EnvironmentConstants];
