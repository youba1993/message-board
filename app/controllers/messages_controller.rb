class MessagesController < ApplicationController

    def index 
        messages = Message.all
        render json: messages
    end 

    def create 
        message = Message.new(message_params)
        if message.save
            ActionCable.server.broadcast 'message_channel' , message
            head :ok        
       else
            head :ok
       end    
    end
    private
    def message_params
        params.require(:message).permit(:content)
    end
end
1